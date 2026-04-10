"use client";
import React, { useEffect, useState } from "react";

export default function StockCard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/hackathon/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="stock-card" className="view-section animate-up">
      <div className="page-header mb-12">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Thẻ kho & Truy vết (Stock Ledger)</h2>
          <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mt-1">Lịch sử biến động tồn kho chi tiết theo thời gian thực</p>
        </div>
        <div className="flex gap-4">
            <div className="content-search relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="text" placeholder="Tìm mã phiếu, SKU..." className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-100 outline-none w-80 font-bold text-sm transition" />
            </div>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 transition">
                <i className="fa-solid fa-file-export mr-2"></i> XUẤT EXCEL
            </button>
        </div>
      </div>

      <div className="card shadow-2xl overflow-hidden border border-gray-50">
        <div className="table-responsive">
          <table className="data-table w-full">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-left">Thời điểm GD</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-center">Loại giao dịch</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-left">Hàng hóa & Mã SKU</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-center">Số lượng</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-center">Biến động</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-left px-8">Nội dung / Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {loading ? (
                <tr><td colSpan={6} className="py-20 text-center text-gray-400 font-bold italic animate-pulse border-none">Đang truy xuất lịch sử thẻ kho...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-gray-400 font-bold">Chưa phát sinh giao dịch nào</td></tr>
              ) : transactions.map((tx) => {
                let statusBadge = "";
                let typeIcon = "";
                let changeColor = "";
                let symbol = "";

                if (tx.type === 'IMPORT') { 
                    statusBadge = "bg-emerald-50 text-emerald-600 border-emerald-100"; 
                    typeIcon = "fa-arrow-down-long";
                    changeColor = "text-emerald-500";
                    symbol = "+";
                } else if (tx.type === 'EXPORT') { 
                    statusBadge = "bg-rose-50 text-rose-500 border-rose-100"; 
                    typeIcon = "fa-arrow-up-long";
                    changeColor = "text-rose-500";
                    symbol = "-";
                } else {
                    statusBadge = "bg-indigo-50 text-indigo-600 border-indigo-100"; 
                    typeIcon = "fa-arrows-left-right";
                    changeColor = "text-indigo-600";
                    symbol = "±";
                }

                return (
                  <tr key={tx._id} className="hover:bg-indigo-50/20 transition-colors group">
                    <td className="py-6 px-8">
                        <div className="flex flex-col">
                            <span className="text-gray-800 font-black text-sm">{new Date(tx.date).toLocaleDateString('vi-VN')}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{new Date(tx.date).toLocaleTimeString('vi-VN')}</span>
                        </div>
                    </td>
                    <td className="py-6 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-black text-[10px] uppercase shadow-sm ${statusBadge}`}>
                            <i className={`fa-solid ${typeIcon} text-[9px]`}></i>
                            {tx.type === 'IMPORT' ? 'NHẬP KHO' : (tx.type === 'EXPORT' ? 'XUẤT KHO' : 'ĐIỀU CHUYỂN')}
                        </span>
                    </td>
                    <td className="py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl group-hover:bg-white flex items-center justify-center text-gray-400 transition-colors">
                                <i className="fa-solid fa-box"></i>
                            </div>
                            <div>
                                <div className="font-black text-gray-800 uppercase text-sm tracking-tight">{tx.productId?.name || 'N/A'}</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{tx.productId?.sku || 'SKU-000'} | {tx.fromLocationId?.rack}{tx.fromLocationId?.bin || 'EXT'}</div>
                            </div>
                        </div>
                    </td>
                    <td className="py-6 text-center text-sm font-black text-gray-600">{tx.quantity}</td>
                    <td className={`py-6 text-center text-2xl font-black tracking-tighter ${changeColor}`}>
                        {symbol}{tx.quantity}
                    </td>
                    <td className="py-6 px-8">
                        <div className="max-w-[300px]">
                            <p className="text-xs font-bold text-gray-500 italic leading-snug line-clamp-2">{tx.note || 'Giao dịch hệ thống tự động ghi nhận'}</p>
                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Ref: {tx._id.slice(-8).toUpperCase()}</p>
                        </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
         <div className="bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100 flex items-center gap-4">
            <button className="text-gray-400 hover:text-indigo-600 transition disabled:opacity-30" disabled><i className="fa-solid fa-chevron-left"></i></button>
            <div className="flex gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                <span className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center text-[10px] font-black hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">2</span>
                <span className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center text-[10px] font-black hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition">3</span>
            </div>
            <button className="text-gray-400 hover:text-indigo-600 transition"><i className="fa-solid fa-chevron-right"></i></button>
         </div>
      </div>
    </section>
  );
}
