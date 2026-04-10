import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { fetchProductByBarcode, postTransaction, fetchLocations } from '../services/api';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const [product, setProduct] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  
  // Trạng thái Form
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocations().then(setLocations);
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>WareMax cần quyền truy cập Camera để quét mã vạch.</Text>
        <Button onPress={requestPermission} title="Cấp Quyền Ngay" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    setLoading(true);
    
    // Call API Backend Laptop
    const prod = await fetchProductByBarcode(data);
    setLoading(false);

    if (prod) {
        setProduct(prod);
    } else {
        Alert.alert("Lỗi", `Không tìm thấy hàng hóa với mã vạch: ${data}`);
        setProduct(null);
    }
  };

  const handleAction = async (type: string) => {
     if (!product) return;
     // Demo: Mặc định chọn Location đầu tiên (Hoặc location 1 nếu là kho tổng)
     const loc = locations[0];
     if (!loc) {
         Alert.alert("Lỗi", "Chưa có vị trí kho trong sơ đồ.");
         return;
     }

     setLoading(true);
     const tx = {
         type: type, // 'IMPORT' hoặc 'EXPORT'
         productId: product._id,
         quantity: quantity,
         toLocationId: type === 'IMPORT' ? loc._id : undefined,
         fromLocationId: type === 'EXPORT' ? loc._id : undefined,
         note: `Thao tác bằng App Quét Barcode (${type === 'IMPORT' ? 'Nhập' : 'Xuất'} hàng)`
     };

     const result = await postTransaction(tx);
     setLoading(false);

     if (result.error) {
         Alert.alert("Giao dịch Thất bại", result.error);
     } else {
         Alert.alert("Thành Công!", `Đã ${type === 'IMPORT' ? 'NHẬP' : 'XUẤT'} ${quantity} ${product.importUnit} ${product.name}`);
         setProduct(null);
         setQuantity('1');
     }
  };

  return (
    <View style={styles.container}>
      {/* KHUNG CAMERA */}
      {!product && (
          <CameraView 
            style={styles.camera} 
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "ean8", "pdf417", "code128", "upc_a", "upc_e"]
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
              <View style={styles.overlay}>
                  <View style={styles.scanBox} />
                  <Text style={styles.scanText}>
                      {loading ? "Đang dò tìm Dữ liệu..." : "Đưa Mã vạch / QR Code vào ô trống"}
                  </Text>
              </View>
          </CameraView>
      )}

      {/* HIỂN THỊ KẾT QUẢ QUÉT */}
      {product && (
          <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>✅ Nhận dạng thành công!</Text>
              
              <View style={styles.card}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSku}>SKU: {product.sku} | Barcode: {product.barcode}</Text>
                <Text style={styles.productCat}>Tỷ lệ Quy đổi: 1 {product.importUnit} = {product.conversionRate} {product.exportUnit}</Text>
              </View>

              <Text style={styles.label}>Số lượng thao tác ({product.importUnit}):</Text>
              <TextInput 
                  style={styles.input}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
              />

              <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.btn, styles.btnIn]} onPress={() => handleAction('IMPORT')} disabled={loading}>
                      <Text style={styles.btnText}>NHẬP KHO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btn, styles.btnOut]} onPress={() => handleAction('EXPORT')} disabled={loading}>
                      <Text style={styles.btnText}>XUẤT KHO</Text>
                  </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.btnCancel} onPress={() => { setProduct(null); setScanned(false); }}>
                  <Text style={styles.btnCancelText}>Hủy Bỏ / Quét Lại</Text>
              </TouchableOpacity>
          </View>
      )}

      {scanned && !product && !loading && (
        <Button title={'Chạm để quét lại'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#F3F4F6' },
  message: { textAlign: 'center', paddingBottom: 10, fontSize: 16 },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: '#34D399', borderRadius: 12, backgroundColor: 'transparent' },
  scanText: { color: 'white', marginTop: 20, fontSize: 16, fontWeight: 'bold' },
  
  resultContainer: { flex: 1, padding: 20, backgroundColor: '#F3F4F6', paddingTop: 60 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: '#10B981', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 3, marginBottom: 20 },
  productName: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  productSku: { fontSize: 14, color: '#6B7280', marginTop: 5 },
  productCat: { fontSize: 14, color: '#3B82F6', marginTop: 5, fontWeight: '500' },
  
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#374151' },
  input: { backgroundColor: 'white', fontSize: 20, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', textAlign: 'center', marginBottom: 25 },
  
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  btn: { flex: 1, padding: 18, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  btnIn: { backgroundColor: '#10B981' },
  btnOut: { backgroundColor: '#EF4444' },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  
  btnCancel: { backgroundColor: '#E5E7EB', padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  btnCancelText: { color: '#4B5563', fontSize: 16, fontWeight: 'bold' },
});
