"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ManagerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Custom Legend States
  const [showImport, setShowImport] = useState(true);
  const [showExport, setShowExport] = useState(true);
  const [hiddenDoughnutIndexes, setHiddenDoughnutIndexes] = useState<number[]>([]);

  useEffect(() => {
    fetch('/hackathon/back-end/dashboard')
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

  const importDataset = {
    label: 'Nhập kho',
    data: stats?.charts?.bar?.import || [0, 0, 0, 0],
    backgroundColor: 'rgba(52, 211, 153, 0.85)', // Green
    borderRadius: 6,
  };

  const exportDataset = {
    label: 'Xuất kho',
    data: stats?.charts?.bar?.export || [0, 0, 0, 0],
    backgroundColor: 'rgba(99, 102, 241, 0.85)', // Indigo
    borderRadius: 6,
  };

  const barData = {
    labels: stats?.charts?.bar?.labels || ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      ...(showImport ? [importDataset] : []),
      ...(showExport ? [exportDataset] : []),
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
      x: { grid: { display: false } }
    }
  };

  const doughnutLabelsRaw = stats?.charts?.doughnut?.labels || ['Thực phẩm', 'Đồ uống', 'Vật tư', 'Thiết bị'];
  const doughnutDataRaw = stats?.charts?.doughnut?.data || [0, 0, 0, 0];
  const doughnutColorsRaw = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

  const doughnutData = {
    labels: doughnutLabelsRaw.filter((_: any, i: number) => !hiddenDoughnutIndexes.includes(i)),
    datasets: [
      {
        data: doughnutDataRaw.filter((_: any, i: number) => !hiddenDoughnutIndexes.includes(i)),
        backgroundColor: doughnutColorsRaw.filter((_: any, i: number) => !hiddenDoughnutIndexes.includes(i)),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    cutout: '75%',
  };

  const toggleDoughnutSlice = (index: number) => {
    setHiddenDoughnutIndexes(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <section id="dashboard" className="view-section animate-fade-in">
      <div className="page-header">
        <h2>Tổng quan Hệ thống</h2>
        <button className="btn btn-primary"><i className="fa-solid fa-plus"></i> Tạo phiếu mới</button>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue"><i className="fa-solid fa-box"></i></div>
          <div className="stat-info">
            <h3>Tổng số hàng hóa</h3>
            <p>{loading ? "..." : (stats?.total_stock?.toLocaleString() || "0")} <span>đơn vị</span></p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green"><i className="fa-solid fa-arrow-right-arrow-left"></i></div>
          <div className="stat-info">
            <h3>Giao dịch hôm nay</h3>
            <p>{loading ? "..." : (stats?.total_tickets || "0")} <span>phiếu</span></p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-orange"><i className="fa-solid fa-triangle-exclamation"></i></div>
          <div className="stat-info">
            <h3>Cảnh báo tồn kho</h3>
            <p>{loading ? "..." : (stats?.alerts_count || "0")} <span>mặt hàng</span></p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple"><i className="fa-solid fa-laptop"></i></div>
          <div className="stat-info">
            <h3>Tài sản đang cấp</h3>
            <p>{loading ? "..." : (stats?.assets_count || "0")} <span>thiết bị</span></p>
          </div>
        </div>
      </div>

      <div className="charts-row">
        {/* Bar Chart */}
        <div className="chart-container card flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h3 className="font-bold text-gray-700">Lưu lượng Xuất / Nhập Kho (Tháng này)</h3>
            <div className="flex gap-4 bg-gray-50 px-4 py-2 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                <input type="checkbox" checked={showImport} onChange={(e) => setShowImport(e.target.checked)} className="w-4 h-4 cursor-pointer accent-emerald-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm"></span> Nhập kho
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                <input type="checkbox" checked={showExport} onChange={(e) => setShowExport(e.target.checked)} className="w-4 h-4 cursor-pointer accent-indigo-500" />
                <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm"></span> Xuất kho
              </label>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            {loading ? <div className="w-full h-full flex items-center justify-center text-gray-400">Đang tải biểu đồ...</div> : <Bar data={barData} options={barOptions} />}
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="chart-container card flex flex-col gap-4">
          <h3 className="font-bold text-gray-700">Tỷ lệ danh mục hàng hóa</h3>
          <div className="flex-1 w-full min-h-[300px] flex items-center relative gap-4">
            {loading ? <div className="w-full text-center text-gray-400">Đang tải...</div> : (
              <>
                <div className="relative w-2/3 h-full flex items-center justify-center">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-gray-800">{doughnutLabelsRaw.length - hiddenDoughnutIndexes.length}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Danh mục</span>
                  </div>
                </div>
                {/* Custom Legend */}
                <div className="w-1/3 flex flex-col justify-center items-start gap-3 border-l border-gray-100 pl-6 py-4">
                  {doughnutLabelsRaw.map((label: string, idx: number) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors w-full">
                      <input 
                        type="checkbox" 
                        checked={!hiddenDoughnutIndexes.includes(idx)} 
                        onChange={() => toggleDoughnutSlice(idx)} 
                        className="w-4 h-4 min-w-[16px] shrink-0 cursor-pointer"
                        style={{ accentColor: doughnutColorsRaw[idx] }}
                      />
                      <span className="w-3 h-3 min-w-[12px] shrink-0 rounded-full shadow-sm" style={{ backgroundColor: doughnutColorsRaw[idx] }}></span>
                      <span className="truncate">{label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
