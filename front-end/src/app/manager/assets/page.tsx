"use client";
import React from "react";

export default function Assets() {
  return (
    <section id="assets" className="view-section">
      <div className="page-header">
        <h2>Quản lý Tài sản (Asset)</h2>
        <button className="btn btn-primary"><i className="fa-solid fa-hand-holding"></i> Cấp phát mới</button>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Lịch sử Cấp phát & Thu hồi - Khấu hao</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã Tài sản</th>
              <th>Tên Tài sản</th>
              <th>Trạng thái</th>
              <th>Người sử dụng</th>
              <th>Nguyên giá</th>
              <th>Khấu hao</th>
              <th>Giá trị còn lại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TS-LAP-001</td>
              <td>MacBook Pro M2</td>
              <td><span className="badge-status bg-green text-green-dark">Đang sử dụng</span></td>
              <td>Nguyễn Văn A (Dev)</td>
              <td>30,000,000đ</td>
              <td>1 năm (20%)</td>
              <td>24,000,000đ</td>
              <td><button className="btn btn-sm btn-outline">Thu hồi</button></td>
            </tr>
            <tr>
              <td>TS-MON-023</td>
              <td>Dell Ultrasharp 27"</td>
              <td><span className="badge-status bg-gray text-gray-dark">Lưu kho</span></td>
              <td>-</td>
              <td>10,000,000đ</td>
              <td>2 năm (40%)</td>
              <td>6,000,000đ</td>
              <td><button className="btn btn-sm btn-outline">Cấp phát</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  );
}
