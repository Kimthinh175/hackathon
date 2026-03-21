"use client";
import React, { useEffect, useState } from "react";

export default function Inventory() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/hackathon/back-end/inventory')
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
    <section id="inventory" className="view-section animate-fade-in">
        <div className="page-header">
            <h2>Quản lý Kho (Inventory)</h2>
            <div className="header-actions">
                <button className="btn btn-primary"><i className="fa-solid fa-truck-moving"></i> Lệnh Chuyển Kho</button>
                <button className="btn btn-secondary"><i className="fa-solid fa-clipboard-check"></i> Tạo Phiếu Kiểm Kê</button>
            </div>
        </div>
        <div className="grid-2">
            <div className="card">
                <div className="card-header">
                    <h3>Lịch sử Chuyển kho gần đây</h3>
                </div>
                <div className="steps-list">
                    {loading ? (
                       <p className="p-6 text-center text-gray-400">Đang tải...</p>
                    ) : data?.recent_transfers?.map((item: any, idx: number) => (
                      <div className="step-item" key={idx}>
                          <div className="step-icon bg-blue"><i className="fa-solid fa-arrow-right-arrow-left"></i></div>
                          <div className="step-content">
                              <h4>{item.desc}</h4>
                              <p>Từ <strong>{item.from}</strong> sang <strong>{item.to}</strong></p>
                          </div>
                          <span className="step-time">{item.time}</span>
                      </div>
                    ))}
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <h3>Kỳ Kiểm kê (Stocktake) đang mở</h3>
                </div>
                {loading ? (
                    <p className="p-6 text-center text-gray-400">Đang tải...</p>
                ) : data?.active_stocktake ? (
                  <div className="stocktake-box">
                      <div className="st-header">{data.active_stocktake.id} ({data.active_stocktake.warehouse})</div>
                      <div className="st-progress">
                          <div className="progress-bar" style={{ width: `${data.active_stocktake.progress_percent}%` }}></div>
                      </div>
                      <p>Đã đếm: {data.active_stocktake.counted}/{data.active_stocktake.total} mã hàng ({data.active_stocktake.progress_percent}%)</p>
                      <div className="st-alert">
                          <i className="fa-solid fa-triangle-exclamation text-orange"></i>
                          <span>Phát hiện {data.active_stocktake.discrepancies} mã chênh lệch -&gt; <a href="#">Tạo phiếu Cân bằng (Adj)</a></span>
                      </div>
                  </div>
                ) : (
                  <p className="p-6 text-center text-gray-400">Không có kỳ kiểm kê nào đang mở</p>
                )}
            </div>
        </div>
    </section>
  );
}
