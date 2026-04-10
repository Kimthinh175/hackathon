"use client";
import React, { useEffect, useState } from "react";

export default function Inventory() {
  const [inventories, setInventories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showTransfer, setShowTransfer] = useState(false);
  const [showAdj, setShowAdj] = useState(false);
  
  // Data for Selects
  const [locations, setLocations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Form States
  const [txForm, setTxForm] = useState({
    productId: '',
    quantity: '',
    fromLocationId: '',
    toLocationId: '',
    note: ''
  });

  const fetchData = () => {
    setLoading(true);
    fetch('/hackathon/api/inventory')
      .then(res => res.json())
      .then(data => {
        setInventories(data);
        setLoading(false);
      });
  };

  const loadReferences = () => {
    if (locations.length === 0) {
      fetch('/hackathon/api/locations').then(res => res.json()).then(setLocations);
      fetch('/hackathon/api/products').then(res => res.json()).then(setProducts);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenTransfer = () => {
    loadReferences();
    setTxForm({ productId: '', quantity: '', fromLocationId: '', toLocationId: '', note: '' });
    setShowTransfer(true);
  };

  const handleOpenAdj = () => {
    loadReferences();
    setTxForm({ productId: '', quantity: '', fromLocationId: '', toLocationId: '', note: '' });
    setShowAdj(true);
  };

  const submitTransaction = async (type: string) => {
    try {
      const res = await fetch('/hackathon/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...txForm, type })
      });
      const data = await res.json();
      if (data.error) {
        alert("Lỗi: " + data.error);
      } else {
        setShowTransfer(false);
        setShowAdj(false);
        fetchData();
      }
    } catch (e: any) {
      alert("Đã xảy ra lỗi: " + e.message);
    }
  };

  return (
    <section id="inventory" className="view-section animate-up">
        <div className="page-header mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-800 tracking-tight">Quản lý Tồn kho & Vận hành</h2>
              <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mt-1">Điều phối hàng hóa (Transfer) & Cân bằng định mức (Adjustment)</p>
            </div>
            <div className="flex gap-4">
                <button onClick={handleOpenTransfer} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 hover:-translate-y-1 transition duration-300">
                    <i className="fa-solid fa-truck-ramp-box mr-2"></i> CHUYỂN HÀNG ĐI
                </button>
                <button onClick={handleOpenAdj} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-emerald-600 hover:-translate-y-1 transition duration-300">
                    <i className="fa-solid fa-scale-balanced mr-2"></i> KIỂM SỐ LƯỢNG MÓN ĐỒ
                </button>
            </div>
        </div>

        <div className="card shadow-2xl overflow-hidden border border-gray-50">
            <div className="bg-white p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-black text-gray-800 uppercase tracking-tighter">Bảng kê chi tiết tồn kho thực tế</h3>
                <button onClick={fetchData} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition"><i className="fa-solid fa-rotate"></i></button>
            </div>
            <div className="table-responsive">
            {loading ? (
                <div className="py-20 text-center text-indigo-400 font-black italic">Đang đồng bộ dữ liệu tồn kho...</div>
            ) : (
                <table className="data-table w-full">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-left">Hàng hóa</th>
                        <th className="py-6 text-[10px] font-black uppercase tracking-widest text-center">Vị trí (Location)</th>
                        <th className="py-6 text-[10px] font-black uppercase tracking-widest text-center">Tồn hiện tại</th>
                        <th className="py-6 text-[10px] font-black uppercase tracking-widest text-center">Mã Lô (Batch)</th>
                        <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-right">Trạng thái FEFO</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                    {inventories.map((inv) => (
                    <tr key={inv._id} className="hover:bg-indigo-50/20 transition-colors group">
                        <td className="py-6 px-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl group-hover:bg-white flex items-center justify-center text-indigo-600 font-black transition-colors">
                                    {inv.productId?.name?.charAt(0) || 'P'}
                                </div>
                                <div className="font-black text-gray-800 uppercase text-sm">{inv.productId?.name || "N/A"}</div>
                            </div>
                        </td>
                        <td className="py-6 text-center">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-600 uppercase">
                                <i className="fa-solid fa-location-dot text-indigo-400"></i>
                                {inv.locationId?.warehouse}-{inv.locationId?.rack}{inv.locationId?.bin}
                            </span>
                        </td>
                        <td className="py-6 text-center font-black text-xl text-indigo-600 tracking-tighter">{inv.quantity}</td>
                        <td className="py-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">{inv.batchNumber}</td>
                        <td className="py-6 px-8 text-right">
                            {inv.expiryDate ? (
                                (() => {
                                    const daysLeft = Math.ceil((new Date(inv.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                    if (daysLeft < 30 && daysLeft > 0) {
                                        return <span className="text-orange-500 font-black text-[10px] uppercase flex items-center justify-end gap-2"><i className="fa-solid fa-clock"></i> Cận Hạn ({daysLeft}d)</span>;
                                    } else if (daysLeft <= 0) {
                                        return <span className="text-rose-600 font-black text-[10px] uppercase flex items-center justify-end gap-2"><i className="fa-solid fa-triangle-exclamation"></i> Đã hết hạn</span>;
                                    }
                                    return <span className="text-emerald-500 font-black text-[10px] uppercase">An toàn (FEFO OK)</span>;
                                })()
                            ) : <span className="text-gray-300 font-black text-[10px] uppercase">N/A</span>}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
            </div>
        </div>

        {/* TRANSFER MODAL */}
        {showTransfer && (
          <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl animate-up overflow-hidden">
              <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black">Lệnh điều chuyển nội bộ</h3>
                <button onClick={() => setShowTransfer(false)} className="hover:rotate-90 transition duration-300"><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
              <div className="p-10 space-y-6">
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Sản phẩm cần chuyển</label>
                   <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition font-bold" value={txForm.productId} onChange={(e) => setTxForm({...txForm, productId: e.target.value})}>
                      <option value="">-- Chọn Sản phẩm --</option>
                      {products.map(p => <option key={p._id} value={p._id}>{p.sku} - {p.name}</option>)}
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Từ Vị trí (Source)</label>
                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition text-sm font-bold" value={txForm.fromLocationId} onChange={(e) => setTxForm({...txForm, fromLocationId: e.target.value})}>
                          <option value="">-- Chọn Nguồn --</option>
                          {locations.map(l => <option key={l._id} value={l._id}>{l.warehouse} | {l.rack}{l.bin}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Đến Vị trí (Dest)</label>
                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition text-sm font-bold" value={txForm.toLocationId} onChange={(e) => setTxForm({...txForm, toLocationId: e.target.value})}>
                          <option value="">-- Chọn Đích --</option>
                          {locations.map(l => <option key={l._id} value={l._id}>{l.warehouse} | {l.rack}{l.bin}</option>)}
                       </select>
                    </div>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Số lượng</label>
                   <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition font-black text-xl text-indigo-600" placeholder="0" value={txForm.quantity} onChange={(e) => setTxForm({...txForm, quantity: e.target.value})} />
                </div>
                <button onClick={() => submitTransaction('TRANSFER')} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition mt-4">XÁC NHẬN ĐIỀU CHUYỂN</button>
              </div>
            </div>
          </div>
        )}
    </section>
  );
}
