"use client";
import React from "react";

export default function StockCard() {
  return (
    <section id="stock-card" className="view-section">
      <div className="page-header">
        <h2>Thẻ kho (Stock Card) - Truy vết lịch sử</h2>
        <div className="search-box">
          <select>
            <option>Kho A</option>
            <option>Kho B</option>
          </select>
          <input type="text" placeholder="Nhập mã hàng (VD: SP001)" />
          <button className="btn btn-primary">Xem Thẻ Kho</button>
        </div>
      </div>
      <div className="card">
        <div className="card-header flex-between">
          <div>
            <h3>Thẻ kho: SP001 - Sữa đặc Ông Thọ</h3>
            <p className="text-sm mt-1">Từ 01/11/2023 đến 30/11/2023</p>
          </div>
          <div className="stock-summary">
            <span>Tồn đầu kỳ: <strong>10 Thùng</strong></span>
            <span>Tồn cuối kỳ: <strong className="text-blue">14 Thùng</strong></span>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Ngày CT</th>
              <th>Số CT</th>
              <th>Diễn giải</th>
              <th>Nhập</th>
              <th>Xuất</th>
              <th>Tồn</th>
              <th>Người thực hiện</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01/11/2023</td>
              <td>-</td>
              <td>Tồn đầu kỳ</td>
              <td>-</td>
              <td>-</td>
              <td><strong>10</strong></td>
              <td>Hệ thống</td>
            </tr>
            <tr>
              <td>05/11/2023</td>
              <td>PNK-001</td>
              <td>Nhập mua từ NCC ABC</td>
              <td className="text-green">+10</td>
              <td>-</td>
              <td><strong>20</strong></td>
              <td>Thủ kho A</td>
            </tr>
            <tr>
              <td>10/11/2023</td>
              <td>PXK-002</td>
              <td>Xuất bán cho Đại lý K</td>
              <td>-</td>
              <td className="text-red">-4</td>
              <td><strong>16</strong></td>
              <td>Thủ kho B</td>
            </tr>
            <tr>
              <td>15/11/2023</td>
              <td>PCK-001</td>
              <td>Chuyển sang Kho B</td>
              <td>-</td>
              <td className="text-orange">-2</td>
              <td><strong>14</strong></td>
              <td>Thủ kho A</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  );
}
