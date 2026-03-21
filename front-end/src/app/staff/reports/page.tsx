"use client";
import React, { useEffect, useState } from "react";

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/hackathon/back-end/reports')
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setData(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const getStatusClass = (status: string) => {
    if (status === 'Trống') return 'status-empty';
    if (status === 'Có hàng') return 'status-occ';
    if (status === 'Đầy') return 'status-full';
    return '';
  };

  return (
    <section id="reports" className="view-section animate-fade-in">
        <div className="page-header text-white bg-indigo-600 p-8 rounded-2xl mb-8 shadow-lg">
            <h2 className="text-3xl font-black">Báo cáo Quản trị Kho</h2>
            <p className="text-indigo-100 opacity-80 mt-2 font-medium">Phân tích dữ liệu & Dự báo thông minh bằng AI</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Movers */}
            <div className="card shadow-xl border-none">
                <div className="card-header border-b border-gray-50 p-6 flex justify-between items-center bg-gray-50/30">
                    <h3 className="font-bold text-gray-800 text-lg">Sản phẩm xuất nhiều (Top Movers)</h3>
                    <span className="badge-status bg-green text-green-dark !py-1 !px-4 text-[10px] font-black uppercase tracking-widest">Hot Items</span>
                </div>
                <div className="p-8">
                    {loading ? (
                       <div className="flex flex-col items-center justify-center py-20 gap-4">
                          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                          <p className="text-gray-400 font-bold">Đang phân tích...</p>
                       </div>
                    ) : (
                      <div className="space-y-6">
                         {data?.top_movers?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-6 group">
                               <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                  #{idx+1}
                               </div>
                               <div className="flex-1">
                                  <div className="flex justify-between items-center mb-2">
                                     <span className="font-black text-gray-700">{item.name}</span>
                                     <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{item.qty} lượt xuất</span>
                                  </div>
                                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                     <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(item.qty/data.top_movers[0].qty) * 100}%` }}></div>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                    )}
                </div>
            </div>
            
            {/* Forecast */}
            <div className="card shadow-xl border-none">
                <div className="card-header border-b border-gray-50 p-6 flex justify-between items-center bg-gray-50/30">
                    <h3 className="font-bold text-gray-800 text-lg">Dự báo nhập hàng (AI Forecast)</h3>
                    <div className="flex items-center gap-2 text-indigo-600">
                      <i className="fa-solid fa-microchip-ai animate-pulse"></i>
                      <span className="text-[10px] font-black uppercase">Core v4.0 Active</span>
                    </div>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                      <thead>
                          <tr>
                              <th className="!bg-transparent text-gray-400">Mã Hàng</th>
                              <th className="!bg-transparent text-right text-gray-400">Tốc độ xuất</th>
                              <th className="!bg-transparent text-right text-gray-400">Tồn kho</th>
                              <th className="!bg-transparent text-right text-gray-400">Gợi ý nhập</th>
                          </tr>
                      </thead>
                      <tbody>
                          {loading ? (
                            <tr><td colSpan={4} className="text-center py-20 text-gray-400 font-bold italic">Đang chạy mô hình dự báo...</td></tr>
                          ) : data?.forecast?.map((item: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                <td><span className="font-black text-gray-800">{item.id}</span></td>
                                <td className="text-right text-sm font-bold text-gray-500">{item.rate} / tháng</td>
                                <td className="text-right font-black text-gray-700">{item.stock}</td>
                                <td className="text-right">
                                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-sm ${item.suggest === 'Không nhập' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-indigo-600 text-white'}`}>
                                    {item.suggest}
                                  </span>
                                </td>
                            </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
            </div>
        </div>
    </section>
  );
}
