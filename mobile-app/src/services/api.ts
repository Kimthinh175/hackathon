import Constants from 'expo-constants';

// Sử dụng trực tiếp Domain thật (Production)
const getApiUrl = () => {
    // Lưu ý: Nếu web NextJS của anh vẫn cài basePath: '/hackathon' trong next.config.ts khi up lên hosting,
    // anh cần sửa lại thành 'https://maxware.ivi.vn/hackathon/api' nhé!
    // Còn nếu anh up lên public_html gốc (domain trần), thì giữ nguyên dòng dưới đây:
    return 'https://maxware.ivi.vn/api'; 

    /* ------------- Dành cho quá trình Dev ngầm (Local LAN) --------------
    const { hostUri } = Constants.expoConfig || {};
    if (hostUri) {
        const ip = hostUri.split(':')[0];
        return `http://${ip}:3000/api`;
    }
    return 'http://10.0.2.2:3000/api';
    ------------------------------------------------------------------- */
};

export const API_BASE_URL = getApiUrl();

export const fetchProductByBarcode = async (barcode: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/products?search=${barcode}`);
        const data = await res.json();
        // Cần lọc chính xác barcode
        if (data && data.length > 0) {
            return data.find((p: any) => p.barcode === barcode) || data[0]; 
        }
        return null;
    } catch (err: any) {
        console.error("API Error: ", err);
        return null;
    }
};

export const postTransaction = async (txData: any) => {
    try {
        const res = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(txData)
        });
        return await res.json();
    } catch (err: any) {
        console.error("API POST Error: ", err);
        return { error: err.message };
    }
};

export const fetchLocations = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/locations`);
        return await res.json();
    } catch (err) {
        return [];
    }
};
