"use client";
import React from "react";

export default function StaffMasterData() {
  return (
    <section id="master-data" className="view-section animate-fade-in">
      <div className="page-header">
        <h2>Tuyên bố & Danh mục Hàng hóa (Master Data)</h2>
        <div className="header-actions">
          <button className="btn btn-outline"><i className="fa-solid fa-print"></i> In Mã Vạch Hàng Loạt</button>
          <button className="btn btn-primary"><i className="fa-solid fa-plus"></i> Thêm Hàng Hóa</button>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Danh sách Sản phẩm & Quy đổi</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Tên Hàng hóa</th>
                <th>ĐVT Chuẩn (Nhập)</th>
                <th>ĐVT Lẻ (Xuất)</th>
                <th>Tỷ lệ Quy đổi</th>
                <th>Mã Vạch / QR</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SP001</td>
                <td>Sữa đặc Ông Thọ</td>
                <td>Thùng</td>
                <td>Lon</td>
                <td>1 Thùng = 48 Lon</td>
                <td><div className="barcode">||||||||||| SP001</div></td>
                <td>
                  <button className="btn-icon"><i className="fa-solid fa-qrcode"></i></button>
                  <button className="btn-icon"><i className="fa-solid fa-pen"></i></button>
                </td>
              </tr>
              <tr>
                <td>SP002</td>
                <td>Nước tinh khiết Aquafina</td>
                <td>Thùng</td>
                <td>Chai</td>
                <td>1 Thùng = 24 Chai</td>
                <td><div className="barcode">||||||||||| SP002</div></td>
                <td>
                  <button className="btn-icon"><i className="fa-solid fa-qrcode"></i></button>
                  <button className="btn-icon"><i className="fa-solid fa-pen"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
