"use client";
import React, { useEffect, useState } from "react";

export default function Assets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    fetch('/hackathon/api/assets')
      .then(res => res.json())
      .then(data => {
        setAssets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (assetId: string, action: string) => {
    let assignedTo = '';
    if (action === 'ALLOCATE') {
      assignedTo = window.prompt("Nhập tên nhân viên được cấp phát:") || '';
      if (!assignedTo) return;
    } else {
      const confirmReturn = window.confirm("Xác nhận thu hồi tài sản này về Kho lưu trữ?");
      if (!confirmReturn) return;
    }

    try {
      const res = await fetch('/hackathon/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, action, assignedTo })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error: any) {
      alert("Lỗi kết nối API");
    }
  };

  return (
    <section id="assets" className="view-section animate-up">
      <div className="page-header mb-12">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Quản lý Đồ dùng & Trang thiết bị</h2>
          <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mt-1">Theo dõi việc sử dụng và cấp phát đồ dùng</p>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 hover:-translate-y-1 transition duration-300">
            <i className="fa-solid fa-file-invoice-dollar mr-2"></i> XEM GIÁ TRỊ ĐỒ DÙNG 
        </button>
      </div>

      <div className="card shadow-2xl overflow-hidden border border-gray-50 bg-white">
        <div className="table-responsive">
          <table className="data-table w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-left">Tài sản & Mã định danh</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-center">Trạng thái</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-center">Nguyên giá (VND)</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-center">Thời gian SD</th>
                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-right">Điều động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-gray-400 font-black italic">Đang đồng bộ danh mục tài sản...</td></tr>
              ) : assets.map(asset => {
                const isInUse = asset.currentStatus === 'IN_USE';
                
                return (
                  <tr key={asset._id} className="hover:bg-indigo-50/20 transition-colors group">
                    <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                                <i className="fa-solid fa-laptop"></i>
                            </div>
                            <div>
                                <div className="font-black text-gray-800 uppercase text-sm tracking-tight">{asset.name}</div>
                                <div className="text-[10px] font-bold text-gray-400 font-mono tracking-widest">{asset.assetCode}</div>
                            </div>
                        </div>
                    </td>
                    <td className="py-6 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-black text-[10px] uppercase shadow-sm
                            ${isInUse ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}
                        `}>
                             <span className={`w-2 h-2 rounded-full ${isInUse ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></span>
                             {isInUse ? 'ĐANG CẤP PHÁT' : 'TRONG KHO'}
                        </span>
                    </td>
                    <td className="py-6 text-center font-black text-gray-700 text-sm">{asset.purchasePrice.toLocaleString('vi-VN')}₫</td>
                    <td className="py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{asset.usefulLifeYears} NĂM</td>
                    <td className="py-6 px-8 text-right">
                        {isInUse ? (
                           <button onClick={() => handleAction(asset._id, 'RETURN')} className="bg-rose-50 text-rose-500 px-6 py-2.5 rounded-xl font-black text-[10px] hover:bg-rose-600 hover:text-white transition shadow-sm uppercase tracking-widest">Lấy lại kho</button>
                        ) : (
                           <button onClick={() => handleAction(asset._id, 'ALLOCATE')} className="bg-emerald-50 text-emerald-600 px-6 py-2.5 rounded-xl font-black text-[10px] hover:bg-emerald-600 hover:text-white transition shadow-sm uppercase tracking-widest">Giao cho người dùng</button>
                        )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
