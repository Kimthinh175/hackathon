"use client";
import React, { useEffect, useState } from "react";

export default function BinLocation() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/hackathon/back-end/bin-location')
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

  return (
    <section id="bin-location" className="view-section animate-fade-in">
        <div className="page-header">
            <h2>Sơ đồ Vị trí kho (Bin Location)</h2>
        </div>
        <div className="card map-card p-6 shadow-xl border-none">
            <div className="map-controls flex justify-between items-center mb-8 bg-gray-50/50 p-4 rounded-xl">
                <select className="px-6 py-3 rounded-xl border-none outline-none bg-white font-bold shadow-sm text-gray-700">
                    <option>Khu vực A (Kệ sắt)</option>
                    <option>Khu vực B (Pallet)</option>
                </select>
                <div className="legend flex gap-6 text-xs font-black uppercase tracking-wider text-gray-400">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white border-2 border-gray-100 shadow-inner"></span> Trống</span>
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-400 shadow-md"></span> Có hàng</span>
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-900 shadow-md shadow-indigo-200"></span> Đầy</span>
                </div>
            </div>
            <div className="warehouse-map grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Rack A */}
                <div className="rack lg:col-span-2 bg-gray-50/50 p-8 rounded-[2rem] border-4 border-white shadow-inner">
                    <div className="rack-title text-center font-black text-gray-300 mb-8 uppercase tracking-[0.3em] text-sm">Main Rack Alpha</div>
                    <div className="tiers flex flex-col gap-6">
                        {loading ? (
                          <div className="h-64 flex flex-col items-center justify-center text-gray-300 gap-4">
                             <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                             <span className="font-black uppercase text-[10px] tracking-widest">Scanning Grid...</span>
                          </div>
                        ) : data?.warehouse_map?.racks?.[0]?.tiers?.map((tier: any, tIdx: number) => (
                          <div className="tier flex items-center gap-6" key={tIdx}>
                              <span className="t-label w-24 text-right text-[10px] font-black text-indigo-300 uppercase leading-none">{tier.name}</span>
                              <div className="bins flex-1 flex gap-3">
                                  {tier.bins.map((bin: any, bIdx: number) => (
                                    <div 
                                      className={`bin flex-1 h-16 flex items-center justify-center rounded-2xl shadow-sm cursor-pointer transition-all hover:scale-110 active:scale-90 text-[10px] font-black ${
                                        bin.status === 'Trống' ? 'bg-white text-gray-200 border-2 border-gray-50' :
                                        bin.status === 'Có hàng' ? 'bg-indigo-400 text-white shadow-lg shadow-indigo-100' :
                                        'bg-indigo-900 text-white shadow-xl shadow-indigo-200'
                                      }`} 
                                      key={bIdx}
                                      title={`${bin.id} (${bin.status})`}
                                    >
                                      {bin.id.split('-').pop()}
                                    </div>
                                  ))}
                              </div>
                          </div>
                        ))}
                    </div>
                </div>
                
                {/* Detail View */}
                <div className="bin-detail bg-white p-8 rounded-[2rem] border border-indigo-50 shadow-2xl shadow-indigo-100/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                    <h3 className="text-xl font-black text-gray-800 mb-8 relative">Bin Insight</h3>
                    {loading ? (
                       <p className="text-gray-400 font-bold italic">Awaiting selection...</p>
                    ) : (
                      <div className="relative">
                        <div className="mb-8">
                           <span className="text-[10px] font-black text-indigo-300 uppercase block mb-2 tracking-widest font-mono">Terminal ID</span>
                           <strong className="text-indigo-600 text-4xl font-black tracking-tighter">{data?.detail?.id}</strong>
                           <div className="mt-2 text-xs font-bold text-gray-400 flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${data?.detail?.status === 'Đầy' ? 'bg-indigo-900' : 'bg-indigo-400'}`}></span>
                              {data?.detail?.status}
                           </div>
                        </div>
                        <div className="mb-10">
                           <span className="text-[10px] font-black text-indigo-300 uppercase block mb-4 tracking-widest font-mono">Payload Inventory</span>
                           <div className="space-y-3">
                              {data?.detail?.contents?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-white shadow-sm group hover:bg-indigo-600 transition-all cursor-default">
                                   <span className="font-black text-gray-700 group-hover:text-white transition-colors">{item.name}</span>
                                   <span className="font-black text-indigo-600 bg-white px-3 py-1 rounded-lg text-xs shadow-sm">{item.qty} {item.unit}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                        <button className="btn btn-primary w-full shadow-2xl shadow-indigo-300 !py-4 rounded-2xl font-black uppercase text-xs tracking-widest">
                           Initialize Transfer
                        </button>
                      </div>
                    )}
                </div>
            </div>
        </div>
    </section>
  );
}
