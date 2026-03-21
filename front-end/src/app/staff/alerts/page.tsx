"use client";
import React from "react";

export default function Alerts() {
  return (
<section id="alerts" className="view-section">
    <div className="page-header">
        <h2>Cảnh báo Tồn kho & Hạn sử dụng</h2>
    </div>
    <div className="grid-2">
        {/* Min Max Alert */}
        <div className="card alert-card">
            <div className="card-header">
                <h3>Cảnh báo Định mức (Min/Max)</h3>
            </div>
            <div className="alert-list">
                <div className="alert-item warning">
                    <div className="al-icon"><i className="fa-solid fa-arrow-down"></i></div>
                    <div className="al-details">
                        <h4>SP010 - Khẩu trang y tế (Dưới mức Min)</h4>
                        <p>Tồn: <strong>5 hộp</strong> / Min: <strong>20 hộp</strong></p>
                    </div>
                    <button className="btn btn-sm btn-primary">Tạo yêu cầu mua</button>
                </div>
                <div className="alert-item danger">
                    <div className="al-icon"><i className="fa-solid fa-arrow-up"></i></div>
                    <div className="al-details">
                        <h4>SP045 - Bút bi Thiên Long (Vượt mức Max)</h4>
                        <p>Tồn: <strong>500 hộp</strong> / Max: <strong>200 hộp</strong></p>
                    </div>
                    <span className="text-xs">Dư thừa</span>
                </div>
            </div>
        </div>
        
        {/* Expiry Alert */}
        <div className="card alert-card">
            <div className="card-header">
                <h3>Cảnh báo Hạn sử dụng (FEFO)</h3>
            </div>
            <div className="alert-list">
                <div className="alert-item error">
                    <div className="al-icon"><i className="fa-solid fa-calendar-xmark"></i></div>
                    <div className="al-details">
                        <h4>Lô Thuốc Paracetamol L001</h4>
                        <p>Hết hạn vào: <strong>15/12/2023</strong> (Còn 5 ngày)</p>
                    </div>
                    <button className="btn btn-sm btn-outline text-red">Ưu tiên xuất</button>
                </div>
                <div className="alert-item warning">
                    <div className="al-icon"><i className="fa-solid fa-calendar-minus"></i></div>
                    <div className="al-details">
                        <h4>Sữa tươi Vinamilk L042</h4>
                        <p>Hết hạn vào: <strong>30/12/2023</strong> (Còn 20 ngày)</p>
                    </div>
                    <button className="btn btn-sm btn-outline text-orange">Ưu tiên xuất</button>
                </div>
            </div>
        </div>
    </div>
</section>

  );
}
