"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function ManagerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({});
  const [showValueModal, setShowValueModal] = useState(false);

  const toggleAlert = (key: string) => {
    setExpandedAlerts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const barData = {
    labels: stats?.charts?.bar?.labels || ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Hàng nhập vào',
        data: stats?.charts?.bar?.import || [0, 0, 0, 0],
        backgroundColor: '#4318FF',
        borderRadius: 10,
        barThickness: 15,
      },
      {
        label: 'Hàng bán ra',
        data: stats?.charts?.bar?.export || [0, 0, 0, 0],
        backgroundColor: '#05CD99',
        borderRadius: 10,
        barThickness: 15,
      },
    ],
  };

  const doughnutData = {
    labels: stats?.charts?.doughnut?.labels || [],
    datasets: [
      {
        data: stats?.charts?.doughnut?.data || [],
        backgroundColor: ['#4318FF', '#05CD99', '#FFCE20', '#39B8FF'],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  return (
    <>
      <section id="dashboard" className="view-section animate-up">
        {/* Top Bar / Quick Actions */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
            <button className="px-6 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-sm">Hôm nay</button>
            <button className="px-6 py-2 rounded-lg text-gray-500 font-bold text-sm hover:bg-gray-50">Tuần này</button>
            <button className="px-6 py-2 rounded-lg text-gray-500 font-bold text-sm hover:bg-gray-50">Tháng này</button>
          </div>
          <div className="flex gap-4">
            <button className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-emerald-600"><i className="fa-solid fa-plus mr-2"></i>Thêm Mới</button>
            <button className="bg-white text-gray-700 border border-gray-200 px-6 py-2 rounded-xl font-bold hover:bg-gray-50 shadow-sm"><i className="fa-solid fa-file-excel text-emerald-600 mr-2"></i>Xuất Báo Cáo</button>
          </div>
        </div>

        {/* KPI Cards (Manager View) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card flex items-center p-6 border-l-4 border-l-blue-500">
            <div className="stat-icon bg-blue-50 text-blue-600 flex items-center justify-center">
              <i className="fa-solid fa-boxes-stacked"></i>
            </div>
            <div className="stat-info ml-4">
              <h3 className="uppercase tracking-widest font-black text-[10px] text-gray-500">Mặt hàng quản lý</h3>
              <p className="text-3xl font-black text-gray-800">{loading ? "..." : (stats?.total_products || 0)}</p>
              <span className="text-blue-500 font-bold text-xs">{loading ? "..." : `${stats?.total_stock} đơn vị kho`}</span>
            </div>
          </div>

          <div className="relative w-full">
            <div
              className="stat-card flex items-center p-6 border-l-4 border-l-emerald-500 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setShowValueModal(!showValueModal)}
            >
              <div className="stat-icon bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-sack-dollar"></i>
              </div>
              <div className="stat-info ml-4 flex-1">
                <h3 className="uppercase tracking-widest font-black text-[10px] text-gray-500">Tổng giá trị tồn kho</h3>
                <p className="text-2xl font-black text-emerald-600">{loading ? "..." : (stats?.total_value || 0).toLocaleString('vi-VN')}₫</p>
                <span className="text-gray-400 font-bold text-xs flex items-center gap-1">
                  Ước tính vốn <i className={`fa-solid fa-chevron-down text-[10px] ml-1 transition-transform ${showValueModal ? 'rotate-180' : ''}`}></i>
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card flex items-center p-6 border-l-4 border-l-indigo-500">
            <div className="stat-icon bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <i className="fa-solid fa-receipt"></i>
            </div>
            <div className="stat-info ml-4">
              <h3 className="uppercase tracking-widest font-black text-[10px] text-gray-500">Đơn hàng hôm nay</h3>
              <p className="text-3xl font-black text-gray-800">{loading ? "..." : (stats?.total_tickets || 0)}</p>
              <span className="text-indigo-500 font-bold text-xs">Vận hành trơn tru</span>
            </div>
          </div>

          <div className="stat-card flex items-center p-6 border-l-4 border-l-orange-500">
            <div className="stat-icon bg-orange-50 text-orange-600 flex items-center justify-center">
              <i className="fa-solid fa-laptop-medical"></i>
            </div>
            <div className="stat-info ml-4">
              <h3 className="uppercase tracking-widest font-black text-[10px] text-gray-500">Tài sản cấp phát</h3>
              <p className="text-3xl font-black text-gray-800">{loading ? "..." : (stats?.assets_count || 0)}</p>
              <span className="text-orange-500 font-bold text-xs">Đang sử dụng</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Alerts Section (Left) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="card p-3 border-t-4 border-t-rose-500">
              <h3 className="text-lg font-black text-gray-800 border-b pb-4 mb-4"><i className="fa-solid fa-bell text-rose-500 mr-2"></i> Cảnh Báo Thông Minh</h3>

              <div className="flex flex-col gap-2">
                {/* Hàng sắp hết (< Min) */}
                <div className="bg-rose-50 rounded-lg flex flex-col shadow-sm border border-rose-100/50 overflow-hidden transition-all">
                  <button onClick={() => toggleAlert('min')} className="flex justify-between items-center w-full p-3 hover:bg-rose-100/50 transition-colors text-left focus:outline-none">
                    <div>
                      <p className="font-bold text-rose-800 flex items-center gap-2">
                        Hàng sắp hết {loading ? '' : `(${stats?.min_alerts?.length || 0})`}
                      </p>
                    </div>
                    <i className={`fa-solid fa-chevron-down text-rose-300 text-xs transition-transform ${expandedAlerts['min'] ? 'rotate-180' : ''}`}></i>
                  </button>

                  {expandedAlerts['min'] && (
                    <div className="px-4 pb-4 pt-2 border-t border-rose-100/50 bg-white/50">
                      <div className="flex justify-between items-center mb-2 px-1 text-[10px] font-bold text-gray-400">
                        <span>Sản phẩm</span>
                        <span>Tồn kho / <span className="text-black">Định mức</span></span>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto pr-1 flex flex-col gap-1 custom-scrollbar">
                        {!loading && stats?.min_alerts?.length > 0 ? (
                          stats.min_alerts.map((item: any) => (
                            <div key={item._id} className="flex justify-between items-center text-sm py-2 border-b border-rose-50 last:border-0">
                              <span className="font-semibold text-gray-700 truncate pr-2 flex-1">{item.name}</span>
                              <span className="font-black bg-rose-50 px-2 py-0.5 rounded text-xs whitespace-nowrap shrink-0 text-black">
                                <span className="text-rose-600">{item.currentQty}</span> / {item.minStock}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500 italic py-2 text-center">Tồn kho đang an toàn.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tồn đọng (> Max) */}
                <div className="bg-orange-50 rounded-lg flex flex-col shadow-sm border border-orange-100/50 overflow-hidden transition-all">
                  <button onClick={() => toggleAlert('max')} className="flex justify-between items-center w-full p-3 hover:bg-orange-100/50 transition-colors text-left focus:outline-none">
                    <div>
                      <p className="font-bold text-orange-800 flex items-center gap-2">
                        Tồn đọng quá lâu {loading ? '' : `(${stats?.max_alerts?.length || 0})`}
                      </p>
                    </div>
                    <i className={`fa-solid fa-chevron-down text-orange-300 text-xs transition-transform ${expandedAlerts['max'] ? 'rotate-180' : ''}`}></i>
                  </button>

                  {expandedAlerts['max'] && (
                    <div className="px-4 pb-4 pt-2 border-t border-orange-100/50 bg-white/50">
                      <div className="flex justify-between items-center mb-2 px-1 text-[10px] font-bold text-gray-400">
                        <span>Sản phẩm</span>
                        <span>Tồn kho / <span className="text-black">Định mức</span></span>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto pr-1 flex flex-col gap-1 custom-scrollbar">
                        {!loading && stats?.max_alerts?.length > 0 ? (
                          stats.max_alerts.map((item: any) => (
                            <div key={item._id} className="flex justify-between items-center text-sm py-2 border-b border-orange-50 last:border-0">
                              <span className="font-semibold text-gray-700 truncate pr-2 flex-1">{item.name}</span>
                              <span className="font-black bg-orange-50 px-2 py-0.5 rounded text-xs whitespace-nowrap shrink-0 text-black">
                                <span className="text-orange-600">{item.currentQty}</span> / {item.maxStock}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500 italic py-2 text-center">Không có hàng tồn đọng.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sắp hết hạn (FEFO) */}
                <div className="bg-yellow-50 rounded-lg flex flex-col shadow-sm border border-yellow-100/50 overflow-hidden transition-all">
                  <button onClick={() => toggleAlert('fefo')} className="flex justify-between items-center w-full p-3 hover:bg-yellow-100/50 transition-colors text-left focus:outline-none">
                    <div>
                      <p className="font-bold text-yellow-800 flex items-center gap-2">
                        Sắp/Đã hết hạn {loading ? '' : `(${stats?.fefo_alerts?.length || 0})`}
                      </p>
                    </div>
                    <i className={`fa-solid fa-chevron-down text-yellow-400 text-xs transition-transform ${expandedAlerts['fefo'] ? 'rotate-180' : ''}`}></i>
                  </button>

                  {expandedAlerts['fefo'] && (
                    <div className="px-4 pb-4 pt-2 border-t border-yellow-100/50 bg-white/50">
                      <div className="flex justify-between items-center mb-2 px-1 text-[10px] font-bold text-gray-400">
                        <span>Lô hàng</span>
                        <span>Hạn dùng</span>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto pr-1 flex flex-col gap-2 custom-scrollbar">
                        {!loading && stats?.fefo_alerts?.length > 0 ? (
                          stats.fefo_alerts.map((item: any) => (
                            <div key={item._id} className="flex flex-col text-sm py-2 border-b border-yellow-50 last:border-0">
                              <span className="font-semibold text-gray-800 truncate">{item.productId?.name}</span>
                              <div className="flex justify-between items-center mt-1.5 gap-2">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 flex-1 truncate px-1.5 py-0.5 rounded">Lô {item.batchNumber}</span>
                                <span className="text-xs font-black text-black bg-yellow-500 px-2 py-0.5 rounded shadow-sm whitespace-nowrap shrink-0">HSD: {new Date(item.expiryDate).toLocaleDateString('vi-VN')}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500 italic py-2 text-center">Tất cả lô hàng đều trong hạn.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tài sản quá hạn */}
                <div className="bg-purple-50 rounded-lg flex flex-col shadow-sm border border-purple-100/50 overflow-hidden transition-all">
                  <button onClick={() => toggleAlert('overdue')} className="flex justify-between items-center w-full p-3 hover:bg-purple-100/50 transition-colors text-left focus:outline-none">
                    <div>
                      <p className="font-bold text-purple-800 flex items-center gap-2">
                        Tài sản quá hạn {loading ? '' : `(${stats?.overdue_assets?.length || 0})`}
                      </p>
                    </div>
                    <i className={`fa-solid fa-chevron-down text-purple-300 text-xs transition-transform ${expandedAlerts['overdue'] ? 'rotate-180' : ''}`}></i>
                  </button>

                  {expandedAlerts['overdue'] && (
                    <div className="px-4 pb-4 pt-2 border-t border-purple-100/50 bg-white/50">
                      <div className="flex justify-between items-center mb-2 px-1 text-[10px] font-bold text-gray-400">
                        <span>Tài sản</span>
                        <span>Mã tài sản</span>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto pr-1 flex flex-col gap-1 custom-scrollbar">
                        {!loading && stats?.overdue_assets?.length > 0 ? (
                          stats.overdue_assets.map((item: any) => (
                            <div key={item._id} className="flex justify-between items-center text-sm py-2 border-b border-purple-50 last:border-0">
                              <span className="font-semibold text-gray-700 truncate pr-2 flex-1">{item.name}</span>
                              <span className="font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-xs whitespace-nowrap shrink-0">{item.assetCode}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500 italic py-2 text-center">Mọi tài sản đang đúng hạn.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section (Right) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="card p-6 h-[400px]">
              <h3 className="text-lg font-black text-gray-800 mb-2">Nhịp độ Nhập - Xuất hàng</h3>
              <p className="text-sm text-gray-500 font-bold mb-4">Biểu đồ so sánh lượng hàng hóa luân chuyển.</p>
              <div className="h-[280px]">
                <Line
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { font: { weight: 'bold', size: 14 } } } },
                    scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
                  }}
                />
              </div>
            </div>

            <div className="card p-6 h-[400px]">
              <h3 className="text-lg font-black text-gray-800 mb-2">Tỷ trọng hàng hóa theo danh mục</h3>
              <p className="text-sm text-gray-500 font-bold mb-4">Biểu đồ phân bổ tỷ lệ các chủng loại sản phẩm trong kho.</p>
              <div className="h-[280px] flex items-center justify-center">
                <div className="relative w-full h-full max-w-[400px]">
                  <Doughnut
                    data={doughnutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'right', labels: { font: { weight: 'bold' } } } },
                      cutout: '60%'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card p-6 mt-8">
          <h3 className="text-lg font-black text-gray-800 border-b pb-4 mb-4"><i className="fa-solid fa-clock-rotate-left text-indigo-500 mr-2"></i> Hoạt động gần đây</h3>
          <div className="flex flex-col gap-3">
            {loading ? (
              <p className="text-gray-400 italic font-bold">Đang tải lịch sử...</p>
            ) : stats?.recent_activities?.length > 0 ? (
              stats.recent_activities.map((act: any) => (
                <div key={act.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition px-2 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                              ${act.type === 'IMPORT' ? 'bg-blue-100 text-blue-600' : act.type === 'EXPORT' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                    <i className={`fa-solid ${act.type === 'IMPORT' ? 'fa-arrow-right-to-bracket' : act.type === 'EXPORT' ? 'fa-arrow-right-from-bracket' : 'fa-right-left'}`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{act.message}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{new Date(act.date).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic font-bold">Chưa có hoạt động nào trong hệ thống.</p>
            )}
          </div>
        </div>

      </section>

      {/* Floating Popup with Transparent Interaction Overlay */}
      {mounted && showValueModal && createPortal(
        <div className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center p-4">
          {/* The Actual Popup */}
          <div
            className="pointer-events-auto w-full max-w-md bg-white rounded-[24px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-gray-200 flex flex-col overflow-hidden animate-fadeIn"
            style={{ height: '500px', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Area */}
            <div className="p-4 border-b flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md">
                  <i className="fa-solid fa-sack-dollar text-lg"></i>
                </div>
                <div>
                  <h3 className="font-black text-gray-800 uppercase tracking-widest text-[11px]">Chi tiết vốn tồn</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Theo danh mục</p>
                </div>
              </div>
              <button
                onClick={() => setShowValueModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-all"
              >
                <i className="fa-solid fa-xmark text-base"></i>
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-1.5 bg-gray-50/20 min-h-0">
              {stats?.value_by_category?.length > 0 ? (
                stats.value_by_category.map((cat: any, idx: number) => (
                  <div key={idx} className="bg-white px-3 py-2 rounded-lg border border-gray-100 flex justify-between items-center shadow-sm hover:border-emerald-300 transition-all">
                    <span className="font-bold text-gray-600 text-[10px] uppercase tracking-tight">{cat._id || 'Khác'}</span>
                    <span className="font-black text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded-lg tabular-nums text-[10px]">
                      {cat.totalValue.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <div className="w-8 h-8 border-3 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Đang tải...</p>
                </div>
              )}
            </div>

            {/* Grand Total Footer */}
            <div className="p-4 bg-white border-t shrink-0">
              <div className="bg-gray-900 p-4 rounded-xl flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-500 uppercase tracking-tighter text-[8px]">Tổng giá trị</span>
                  <span className="font-black text-white text-xl tracking-tight">
                    {(stats?.total_value || 0).toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

