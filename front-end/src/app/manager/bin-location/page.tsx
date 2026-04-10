"use client";
import React, { useEffect, useState } from "react";

export default function BinLocation() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoc, setSelectedLoc] = useState<any>(null);

  useEffect(() => {
    fetch('/hackathon/api/locations')
      .then(res => res.json())
      .then(data => {
        setLocations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="bin-location" className="view-section animate-up">
      <div className="page-header mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Sơ đồ Vị trí Ô kệ (Bin Map)</h2>
          <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mt-1">Quản lý không gian & Tối ưu luồng nhặt hàng</p>
        </div>
        <div className="flex gap-4">
            <div className="legend flex items-center gap-6 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
                <span className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase"><span className="w-3 h-3 rounded-full border-2 border-gray-200"></span> Trống</span>
                <span className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Có hàng</span>
                <span className="flex items-center gap-2 text-xs font-black text-rose-500 uppercase"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Đầy (Full)</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 card p-10 bg-gray-50/50 border-dashed border-2 border-gray-200">
           <div className="warehouse-map-v2">
             {loading ? (
                <div className="py-20 text-center text-gray-400 font-bold animate-pulse">Đang dựng bản đồ kho từ DB...</div>
             ) : (
                <div className="rack-row flex flex-wrap gap-12 justify-center">
                    {['A', 'B'].map(rackName => (
                        <div key={rackName} className="flex flex-col items-center gap-4">
                            <span className="text-sm font-black text-indigo-400 uppercase tracking-[4px]">Kệ {rackName}</span>
                            <div className="rack-stack">
                                {[3, 2, 1].map(tier => (
                                    <div key={tier} className="flex gap-3">
                                        {[1, 2, 3].map(bin => {
                                            const loc = locations.find(l => l.rack === rackName && l.tier === tier && l.bin === bin);
                                            const isSelected = selectedLoc?._id === loc?._id;
                                            
                                            let statusClass = "";
                                            if (loc?.status === 'occupied') statusClass = "bin-occupied";
                                            if (loc?.status === 'full') statusClass = "bin-full";

                                            return (
                                                <div 
                                                    key={`${rackName}-${tier}-${bin}`} 
                                                    onClick={() => loc && setSelectedLoc(loc)}
                                                    className={`bin-box cursor-pointer ${statusClass} ${isSelected ? 'ring-4 ring-indigo-400 scale-110 z-10' : ''}`}
                                                >
                                                    {rackName}{bin}
                                                    <span className="opacity-40 font-black text-[8px] absolute top-1 right-1">T{tier}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
             )}
           </div>
        </div>

        <div className="lg:col-span-1">
           <div className="card p-10 sticky top-10 shadow-2xl border-indigo-100">
              <h3 className="text-xl font-black text-gray-800 mb-6 border-b pb-4 flex items-center gap-3">
                <i className="fa-solid fa-circle-info text-indigo-600"></i>
                Chi tiết Vị trí
              </h3>
              
              {!selectedLoc ? (
                  <div className="py-20 flex flex-col items-center text-center gap-4 animate-pulse">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-4xl">
                        <i className="fa-solid fa-hand-pointer"></i>
                      </div>
                      <p className="text-gray-300 font-bold text-sm">Vui lòng chọn một ô kệ trên <br/> sơ đồ để xem thông tin</p>
                  </div>
              ) : (
                  <div className="space-y-8 animate-up">
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Mã định danh ô</p>
                              <p className="text-4xl font-black text-indigo-600 font-mono tracking-tighter">{selectedLoc.warehouse}-{selectedLoc.rack}{selectedLoc.bin}</p>
                          </div>
                          <div className="text-right">
                              <span className={`px-4 py-1.5 rounded-full text-white font-black text-[10px] uppercase shadow-md
                                ${selectedLoc.status === 'empty' ? 'bg-gray-400' : (selectedLoc.status === 'full' ? 'bg-rose-500' : 'bg-emerald-500')}
                              `}>
                                {selectedLoc.status === 'empty' ? "TRỐNG" : (selectedLoc.status === 'full' ? "HẾT CHỖ" : "CÓ HÀNG")}
                              </span>
                          </div>
                      </div>

                      <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100">
                         <div className="flex justify-between mb-4">
                            <span className="text-xs font-black text-indigo-400 uppercase">Khả năng chứa</span>
                            <span className="text-xs font-black text-indigo-700">{selectedLoc.currentQuantity} / 100</span>
                         </div>
                         <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner flex">
                            <div 
                                className={`h-full transition-all duration-700 ${selectedLoc.status === 'full' ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                                style={{ width: `${Math.min(selectedLoc.currentQuantity, 100)}%` }}
                            ></div>
                         </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button className="bg-indigo-600 text-white p-4 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 transition">
                            <i className="fa-solid fa-arrows-left-right mr-2"></i> LỆNH ĐIỀU CHUYỂN Ô
                        </button>
                        <button className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl font-black text-sm hover:bg-emerald-600 hover:text-white transition">
                            <i className="fa-solid fa-clipboard-check mr-2"></i> KIỂM ĐỊNH VỊ TRÍ
                        </button>
                      </div>
                  </div>
              )}
           </div>
        </div>
      </div>
    </section>
  );
}
