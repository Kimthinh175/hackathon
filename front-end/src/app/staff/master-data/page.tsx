"use client";
import React, { useEffect, useState } from "react";

export default function MasterData() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '', name: '', category: 'Thực phẩm', importUnit: 'Thùng', exportUnit: 'Lon', conversionRate: 24, barcode: '', minStock: 10, maxStock: 500
  });

  const fetchProducts = () => {
    setLoading(true);
    fetch('/hackathon/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/hackathon/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        setShowModal(false);
        fetchProducts();
      } else {
        alert("Có lỗi xảy ra khi thêm sản phẩm");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <section id="master-data" className="view-section animate-up">
      <div className="page-header mb-12">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Danh mục Hàng hóa</h2>
          <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mt-1">Dữ liệu Master & Quy tắc quy đổi đơn vị</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 hover:-translate-y-1 transition duration-300">
          <i className="fa-solid fa-plus mr-2"></i> THÊM MÓN MỚI
        </button>
      </div>

      <div className="card shadow-xl overflow-hidden">
        <div className="table-responsive">
          <table className="data-table w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left py-6 px-8">HÀNG HÓA & PHÂN LOẠI</th>
                <th className="text-center">MÃ VẠCH (128)</th>
                <th className="text-center">QUY ĐỔI ĐƠN VỊ</th>
                <th className="text-center">ĐỊNH MỨC TỒN</th>
                <th className="text-right px-8">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-gray-400 font-bold italic">Đang đồng bộ dữ liệu với MongoDB...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-gray-400 font-bold">Chưa có sản phẩm nào trong hệ thống</td></tr>
              ) : products.map((p) => (
                <tr key={p._id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-lg">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-gray-800 text-lg uppercase tracking-tight">{p.name}</div>
                        <div className="text-[10px] font-bold text-gray-400 tracking-widest">{p.sku} | {p.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-6">
                    <span className="visual-barcode">{p.barcode || p.sku}</span>
                    <span className="text-[10px] font-bold tracking-[3px] text-gray-300 uppercase">{p.barcode || p.sku}</span>
                  </td>
                  <td className="text-center py-6">
                    <div className="flex flex-col items-center gap-1">
                        <span className="conversion-badge">
                            <i className="fa-solid fa-arrows-left-right text-[10px]"></i>
                            1 {p.importUnit} = {p.conversionRate} {p.exportUnit}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Tự động nhân số lượng</span>
                    </div>
                  </td>
                  <td className="text-center py-6">
                    <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                        <span className="text-rose-500 font-black text-xs">{p.minStock}</span>
                        <span className="text-gray-300 font-black">/</span>
                        <span className="text-indigo-600 font-black text-xs">{p.maxStock}</span>
                    </div>
                  </td>
                  <td className="text-right py-6 px-8">
                    <div className="flex justify-end gap-2">
                        <button className="btn-icon bg-gray-50 hover:bg-white hover:shadow-md"><i className="fa-solid fa-pen-to-square"></i></button>
                        <button onClick={() => window.print()} className="btn-icon bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-md"><i className="fa-solid fa-print"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl animate-up overflow-hidden">
            <div className="bg-indigo-600 p-8 text-white flex justify-between items-center relative">
                <div>
                    <h3 className="text-2xl font-black">Thêm sản phẩm mới</h3>
                    <p className="opacity-80 text-xs font-bold mt-1 tracking-widest uppercase">Thiết lập dữ liệu Master chuẩn hóa</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition duration-300"><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-10 grid grid-cols-2 gap-6">
                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Tên sản phẩm</label>
                    <input required type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition" placeholder="VD: Nước giải khát Coca" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Danh mục</label>
                    <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                        <option>Thực phẩm</option>
                        <option>Đồ uống</option>
                        <option>Vật tư y tế</option>
                        <option>Văn phòng phẩm</option>
                        <option>Điện tử</option>
                    </select>
                </div>
                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Mã hiệu SKU</label>
                    <input required type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition font-mono" placeholder="PROD-001" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value, barcode: e.target.value})} />
                </div>
                <div className="col-span-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Tỷ lệ quy đổi (Units)</label>
                    <input required type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition font-bold" value={newProduct.conversionRate} onChange={e => setNewProduct({...newProduct, conversionRate: parseInt(e.target.value)})} />
                </div>
                <div className="col-span-2 pt-6 border-t border-gray-100 flex justify-end gap-4 mt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 font-black text-gray-400 hover:text-gray-600 transition">Hủy bỏ</button>
                    <button type="submit" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-700 hover:-translate-y-1 transition duration-300">LƯU SẢN PHẨM</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
