"use client";
import React, { useEffect, useState } from "react";

export default function Reports() {
    const [reports, setReports] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/hackathon/api/reports')
            .then(res => res.json())
            .then(data => {
                setReports(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="p-20 text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-600 font-black text-xl tracking-widest uppercase">Đang kết xuất Báo cáo AI WareMax...</p>
        </div>
    );

    return (
        <section id="reports" className="view-section animate-up">
            <div className="page-header mb-12">
                <div>
                  <h2 className="text-3xl font-black text-gray-800 tracking-tight">Báo cáo Thông minh (AI Dự đoán)</h2>
                  <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mt-1">Máy tính sẽ giúp anh biết món nào bán chạy, món nào ế</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3 shadow-sm">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Máy tính đang sẵn sàng</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Slow moving - Widget lớn */}
                <div className="card lg:col-span-1 p-10 bg-white shadow-2xl relative overflow-hidden group border border-gray-50">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <h3 className="text-lg font-black text-gray-800 mb-10 border-l-[6px] border-orange-500 pl-4 uppercase tracking-tighter">Hàng chất đống lâu ngày (Ế)</h3>

                    <div className="flex flex-col items-center justify-center">
                        <div className="w-48 h-48 rounded-full border-[14px] border-orange-50 flex items-center justify-center relative shadow-inner">
                            <span className="text-5xl text-orange-600 font-black tracking-tighter">{reports?.slowMoving?.percent}%</span>
                            <div className="absolute inset-0 rounded-full border-[14px] border-orange-500 border-t-transparent border-r-transparent -rotate-45 shadow-sm"></div>
                        </div>
                        <p className="mt-10 text-gray-500 text-center text-sm font-medium leading-relaxed px-2">
                           Dựa trên ngày nhập hàng, máy tính thấy <span className="text-orange-600 font-black">{reports?.slowMoving?.percent}%</span> hàng hóa của anh nằm im trong kho hơn <span className="font-black">90 ngày</span>.
                        </p>
                    </div>

                    <div className="mt-12 bg-gray-50 rounded-3xl p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số mặt hàng tồn kho lâu</span>
                            <span className="text-2xl font-black text-orange-600">{reports?.slowMoving?.count}</span>
                        </div>
                        <button className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-xs shadow-xl shadow-orange-100 hover:-translate-y-1 transition duration-300">
                             LẬP KẾ HOẠCH BÁN XẢ HÀNG
                        </button>
                    </div>
                </div>

                {/* AI Forecast - Bảng chi tiết */}
                <div className="card lg:col-span-2 p-10 shadow-xl border border-indigo-50 bg-white">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-lg font-black text-gray-800 border-l-[6px] border-indigo-600 pl-4 uppercase tracking-tighter">Dự báo món nào sắp bán chạy (Sắp tới)</h3>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-gray-100">
                        <table className="w-full text-left">
                            <thead className="bg-indigo-600 text-white">
                                <tr>
                                    <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest">Sản phẩm phân tích</th>
                                    <th className="py-5 text-[10px] font-black uppercase tracking-widest text-center">Tiêu thụ (30d)</th>
                                    <th className="py-5 text-[10px] font-black uppercase tracking-widest text-center">Tồn khả dụng</th>
                                    <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-right">Khuyến nghị AI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {reports?.forecast?.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-indigo-50/20 transition-colors">
                                        <td className="p-6">
                                            <div className="font-black text-gray-800 uppercase text-sm tracking-tight">{item.product.name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.product.sku}</div>
                                        </td>
                                        <td className="p-6 text-center text-sm font-black text-emerald-600">
                                            <i className="fa-solid fa-arrow-trend-up mr-2"></i>{item.velocity}
                                        </td>
                                        <td className="p-6 text-center font-black text-gray-600 text-sm">{item.currentStock} {item.product.exportUnit}</td>
                                        <td className="p-6 text-right">
                                            {item.suggested > 0 ? 
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm tracking-widest">MUA THÊM</span>
                                                    <span className="text-emerald-500 font-black text-lg tracking-tighter">+{item.suggested}</span>
                                                </div>
                                                :
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="bg-gray-400 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm tracking-widest">DUY TRÌ</span>
                                                    <span className="text-gray-400 font-black text-xs">TỒN AN TOÀN</span>
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div className="mt-10 card p-8 bg-indigo-900 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-[-20deg] translate-x-12"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <div>
                            <h4 className="text-xl font-black italic tracking-tight">WareMax Intelligence Hub</h4>
                            <p className="opacity-60 text-[10px] font-black uppercase tracking-widest">Phát triển bởi đội ngũ kỹ sư AI tại Hackathon WareMax</p>
                        </div>
                    </div>
                    <button className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-950/20 hover:scale-105 hover:bg-emerald-400 transition active:scale-95">XUẤT BẢN BÁO CÁO ĐẦY ĐỦ</button>
                </div>
            </div>
        </section>
    );
}
