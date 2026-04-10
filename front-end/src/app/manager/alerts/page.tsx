"use client";
import React, { useEffect, useState } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/hackathon/api/alerts')
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
        <div className="p-20 text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-rose-500 font-black text-xl tracking-widest uppercase">Đang quét định mức tồn kho & Hạn dùng...</p>
        </div>
  );

  return (
    <section id="alerts" className="view-section animate-up">
        <div className="page-header mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-800 tracking-tight">Báo động: Hàng sắp hết hoặc Hết hạn</h2>
              <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mt-1">Danh sách hàng cần để ý để nhập thêm hoặc bán gấp</p>
            </div>
            <div className="flex gap-4">
                <div className="bg-rose-50 px-6 py-3 rounded-2xl border border-rose-100 flex items-center gap-3">
                    <span className="text-xs font-black text-rose-600 uppercase tracking-widest">Tìm thấy: {(alerts?.minMax?.length || 0) + (alerts?.fefo?.length || 0)} món cần chú ý</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Min Max Alert */}
            <div className="card p-8 bg-white shadow-xl border border-indigo-50 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-10 border-b pb-6 border-gray-50">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
                        <i className="fa-solid fa-arrow-down-short-wide"></i>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Hàng cần nhập thêm (Sắp hết)</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Món nào ít hơn mức quy định sẽ hiện ở đây</p>
                    </div>
                </div>

                <div className="alert-list flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                    {alerts?.minMax?.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center gap-4 bg-emerald-50 rounded-3xl animate-pulse">
                            <i className="fa-solid fa-circle-check text-5xl text-emerald-500"></i>
                            <p className="text-emerald-700 font-black text-sm uppercase tracking-widest">Toàn bộ hàng hóa đạt chuẩn Min/Max</p>
                        </div>
                    )}
                    {alerts?.minMax?.map((item: any, idx: number) => (
                      <div key={idx} className={`alert-item shadow-sm p-5 border-l-[6px] ${item.type === 'MIN' ? 'bg-orange-50 border-orange-500' : 'bg-rose-50 border-rose-500'}`}>
                          <div className="flex items-center gap-4 justify-between w-full">
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${item.type === 'MIN' ? 'bg-white text-orange-500' : 'bg-white text-rose-500'}`}>
                                    {item.type === 'MIN' ? <i className="fa-solid fa-arrow-down"></i> : <i className="fa-solid fa-arrow-up"></i>}
                                  </div>
                                  <div>
                                      <h4 className="font-black text-gray-800 uppercase tracking-tight text-sm line-clamp-1">{item.product.name}</h4>
                                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SKU: {item.product.sku} | Loại: {item.type}</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="text-xl font-black text-gray-800 tracking-tighter">{item.currentStock} <span className="text-[10px] text-gray-400 uppercase">{item.product.exportUnit}</span></p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">Yêu cầu: {item.type === 'MIN' ? item.product.minStock : item.product.maxStock}</p>
                              </div>
                          </div>
                      </div>
                    ))}
                </div>
                
                <div className="mt-auto pt-8 border-t border-gray-50">
                    <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">TẠO PHIẾU MUA HÀNG NGAY</button>
                </div>
            </div>
            
            {/* Expiry Alert */}
            <div className="card p-8 bg-white shadow-xl border border-rose-50 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-10 border-b pb-6 border-gray-50">
                    <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white text-xl">
                        <i className="fa-solid fa-calendar-xmark"></i>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Hàng sắp hết hạn dùng</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Những món đồ sắp hỏng cần bán gấp hoặc bỏ đi</p>
                    </div>
                </div>

                <div className="alert-list flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                    {alerts?.fefo?.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center gap-4 bg-emerald-50 rounded-3xl animate-pulse">
                            <i className="fa-solid fa-calendar-check text-5xl text-emerald-500"></i>
                            <p className="text-emerald-700 font-black text-sm uppercase tracking-widest">Không có hàng cận date / hết hạn</p>
                        </div>
                    )}
                    {alerts?.fefo?.map((inv: any) => {
                        const daysLeft = Math.ceil((new Date(inv.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                        const isExpired = daysLeft <= 0;

                        return (
                          <div key={inv._id} className={`alert-item shadow-sm p-5 border-l-[6px] ${isExpired ? 'bg-rose-50 border-rose-600' : 'bg-orange-50 border-orange-500'}`}>
                              <div className="flex items-center gap-4 justify-between w-full">
                                  <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${isExpired ? 'bg-white text-rose-600' : 'bg-white text-orange-500'}`}>
                                        {isExpired ? <i className="fa-solid fa-skull-crossbones"></i> : <i className="fa-solid fa-clock"></i>}
                                      </div>
                                      <div>
                                          <h4 className="font-black text-gray-800 uppercase tracking-tight text-sm line-clamp-1">{inv.productId?.name}</h4>
                                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lô: {inv.batchNumber} | Ô kệ: {inv.locationId?.rack}{inv.locationId?.bin}</p>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <p className={`text-xl font-black tracking-tighter ${isExpired ? 'text-rose-600' : 'text-orange-600'}`}>{isExpired ? 'HẾT HẠN' : daysLeft + ' ngày'}</p>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(inv.expiryDate).toLocaleDateString('vi-VN')}</p>
                                  </div>
                              </div>
                          </div>
                        )
                    })}
                </div>

                <div className="mt-auto pt-8 border-t border-gray-50">
                    <button className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black text-xs shadow-xl shadow-rose-100 hover:bg-rose-700 transition">TẠO LỆNH BỎ HÀNG / XẢ KHO</button>
                </div>
            </div>
        </div>
    </section>
  );
}
