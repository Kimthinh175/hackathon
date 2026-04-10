"use client";
import React, { useEffect, useState } from "react";

export default function StaffDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/hackathon/api/dashboard')
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setStats(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="dashboard" className="view-section animate-up">
      {/* Quick Actions (Staff View - Massive Buttons) */}
      <h2 className="text-2xl font-black text-gray-800 mb-6">Nghiệp Vụ Kho (Thao Tác Nhanh)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <button className="bg-indigo-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 hover:-translate-y-1 hover:shadow-xl transition active:translate-y-0 group border-b-4 border-indigo-800">
              <div className="text-4xl group-hover:scale-110 transition-transform"><i className="fa-solid fa-barcode"></i></div>
              <span className="font-black text-sm uppercase tracking-widest text-indigo-50">Quét Mã Vạch</span>
          </button>

          <button className="bg-emerald-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 hover:-translate-y-1 hover:shadow-xl transition active:translate-y-0 group border-b-4 border-emerald-700">
              <div className="text-4xl group-hover:scale-110 transition-transform"><i className="fa-solid fa-boxes-packing"></i></div>
              <span className="font-black text-sm uppercase tracking-widest text-emerald-50">Tạo Phiếu Nhập</span>
          </button>

          <button className="bg-orange-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg shadow-orange-500/20 hover:-translate-y-1 hover:shadow-xl transition active:translate-y-0 group border-b-4 border-orange-700">
              <div className="text-4xl group-hover:scale-110 transition-transform"><i className="fa-solid fa-truck-ramp-box"></i></div>
              <span className="font-black text-sm uppercase tracking-widest text-orange-50">Tạo Phiếu Xuất</span>
          </button>

          <button className="bg-rose-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg shadow-rose-500/20 hover:-translate-y-1 hover:shadow-xl transition active:translate-y-0 group border-b-4 border-rose-700">
              <div className="text-4xl group-hover:scale-110 transition-transform"><i className="fa-solid fa-clipboard-check"></i></div>
              <span className="font-black text-sm uppercase tracking-widest text-rose-50">Kiểm Kê Kho</span>
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* To-Do List (Picking / Putaway) */}
          <div className="flex flex-col gap-6">
              <div className="card p-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                      <h3 className="text-lg font-black text-gray-800"><i className="fa-solid fa-list-check text-blue-500 mr-2"></i> Phiếu Cần Xử Lý Ngay</h3>
                      <span className="bg-blue-100 text-blue-700 font-black text-xs px-3 py-1 rounded-full">Hôm nay</span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                      {/* Fake data mapping operational tasks, but using the real total_tickets stat to show dynamic data */}
                      <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-emerald-500 flex justify-between items-center hover:bg-emerald-50 transition cursor-pointer">
                          <div>
                              <p className="font-bold text-gray-800">Nhập hàng vào kho (Putaway)</p>
                              <p className="text-xs text-gray-500 mt-1">Từ nhà cung cấp. Sẵn sàng xếp kệ.</p>
                          </div>
                          <span className="text-emerald-600 font-black bg-emerald-100 w-8 h-8 rounded-full flex items-center justify-center">{loading ? '-' : Math.floor((stats?.total_tickets || 3) / 2)}</span>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-orange-500 flex justify-between items-center hover:bg-orange-50 transition cursor-pointer">
                          <div>
                              <p className="font-bold text-gray-800">Nhặt hàng xuất kho (Picking)</p>
                              <p className="text-xs text-gray-500 mt-1">Đơn hàng cần giao hôm nay.</p>
                          </div>
                          <span className="text-orange-600 font-black bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center">{loading ? '-' : Math.ceil((stats?.total_tickets || 2) / 2)}</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Critical Operational Alerts */}
          <div className="flex flex-col gap-6">
              <div className="card p-6 border border-gray-100">
                  <h3 className="text-lg font-black text-gray-800 border-b pb-4 mb-6"><i className="fa-solid fa-triangle-exclamation text-yellow-500 mr-2"></i> Chú ý tại kho</h3>
                  
                  <div className="flex flex-col gap-3">
                      <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl">
                          <p className="font-bold text-yellow-800"><i className="fa-solid fa-calendar-xmark mr-2 text-yellow-600"></i> Hàng sắp hết hạn (FEFO)</p>
                          <p className="text-sm text-yellow-700 mt-2 font-medium">Hệ thống phát hiện có <span className="font-black text-lg">{loading ? '-' : (stats?.fefo_alerts?.length || 0)}</span> sản phẩm sắp hết hạn. Cần kiểm tra và ưu tiên xuất kho.</p>
                      </div>

                      <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl mt-2">
                          <p className="font-bold text-rose-800"><i className="fa-solid fa-box-open mr-2 text-rose-600"></i> Hết chỗ trống (Vị trí chứa)</p>
                          <p className="text-sm text-rose-700 mt-2 font-medium">Khu vực A (Kệ đồ uống) hiện đang đầy 95%. Chú ý không xếp chung hàng có cồn.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
}

