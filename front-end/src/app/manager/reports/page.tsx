"use client";
import React from "react";

export default function Reports() {
    return (
        <section id="reports" className="view-section">
            <div className="page-header">
                <h2>Báo cáo Quản trị Kho</h2>
            </div>
            <div className="grid-2">
                {/* Slow moving */}
                <div className="card">
                    <div className="card-header">
                        <h3>Phân tích Tuổi kho (Slow Moving Items)</h3>
                    </div>
                    <div className="chart-container">
                        <canvas id="ageChart"></canvas>
                    </div>
                    <p className="text-sm mt-3 text-center text-gray">Mặt hàng tồn &gt; 90 ngày: <strong>25% tổng kho</strong>. Cần giải phóng.</p>
                </div>

                {/* Forecast */}
                <div className="card">
                    <div className="card-header">
                        <h3>Dự báo nhập hàng (AI Forecast)</h3>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Mã Hàng</th>
                                <th>Tốc độ xuất (30 ngày)</th>
                                <th>Tồn hiện tại</th>
                                <th>Gợi ý cần nhập</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>SP001</td>
                                <td>200 / tháng</td>
                                <td>50</td>
                                <td><span className="badge bg-blue text-white">+ 250 Thùng</span></td>
                            </tr>
                            <tr>
                                <td>SP022</td>
                                <td>50 / tháng</td>
                                <td>10</td>
                                <td><span className="badge bg-blue text-white">+ 60 Thùng</span></td>
                            </tr>
                            <tr>
                                <td>SP033</td>
                                <td>5 / tháng</td>
                                <td>100</td>
                                <td><span className="badge bg-red text-white">Không nhập (Tồn ế)</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

    );
}
