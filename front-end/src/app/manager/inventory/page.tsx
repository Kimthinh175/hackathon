"use client";
import React from "react";

export default function Inventory() {
    return (
        <section id="inventory" className="view-section">
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
                        <div className="step-item">
                            <div className="step-icon bg-blue"><i className="fa-solid fa-arrow-right-arrow-left"></i></div>
                            <div className="step-content">
                                <h4>Chuyển 50 Thùng SP001</h4>
                                <p>Từ <strong>Kho A (Tầng trệt)</strong> sang <strong>Kho B (Tầng 2)</strong></p>
                            </div>
                            <span className="step-time">Hôm nay 10:30</span>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h3>Kỳ Kiểm kê (Stocktake) đang mở</h3>
                    </div>
                    <div className="stocktake-box">
                        <div className="st-header">KK-2023-11 (Kho A)</div>
                        <div className="st-progress">
                            <div className="progress-bar" style={{ "width": "65%" }}></div>
                        </div>
                        <p>Đã đếm: 130/200 mã hàng</p>
                        <div className="st-alert">
                            <i className="fa-solid fa-triangle-exclamation text-orange"></i>
                            <span>Phát hiện 3 mã chênh lệch -&gt; <a href="#">Tạo phiếu Cân bằng (Adj)</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}
