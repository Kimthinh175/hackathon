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

  const barData = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Nhập kho',
        data: [350, 420, 200, 500],
        backgroundColor: 'rgba(52, 211, 153, 0.85)', // Green
        borderRadius: 6,
      },
      {
        label: 'Xuất kho',
        data: [280, 390, 250, 460],
        backgroundColor: 'rgba(99, 102, 241, 0.85)', // Indigo
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
      x: { grid: { display: false } }
    }
  };

  const doughnutData = {
    labels: ['Thực phẩm', 'Đồ uống', 'Vật tư', 'Thiết bị'],
    datasets: [
      {
        data: [45, 25, 15, 15],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const },
    },
    cutout: '75%',
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
                    <h3>Phiếu giao dịch</h3>
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
            <div className="chart-container card flex flex-col gap-4">
                <h3 className="font-bold text-gray-700">Lưu lượng Xuất / Nhập Kho (Tháng này)</h3>
                <div className="flex-1 w-full min-h-[300px]">
                  <Bar data={barData} options={barOptions} />
                </div>
            </div>
            <div className="chart-container card flex flex-col gap-4">
                <h3 className="font-bold text-gray-700">Tỷ lệ danh mục hàng hóa</h3>
                <div className="flex-1 w-full min-h-[300px] flex items-center justify-center relative">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-3xl font-black text-gray-800">{loading ? "..." : "4"}</span>
                     <span className="text-xs text-gray-400 font-bold uppercase">Danh mục</span>
                  </div>
                </div>
            </div>
        </div>
    </section>
  );
}
