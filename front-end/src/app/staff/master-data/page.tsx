"use client";
import React, { useEffect, useState } from "react";

export default function StaffMasterData() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/hackathon/back-end/master-data')
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setProducts(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

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
                            <th>Phân loại</th>
                            <th>ĐVT Chuẩn</th>
                            <th>ĐVT Lẻ</th>
                            <th>Tỷ lệ (1 Thùng =)</th>
                            <th>Mã Vạch / QR</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                          <tr><td colSpan={8} className="text-center py-10 text-gray-400">Đang tải dữ liệu...</td></tr>
                        ) : products.length === 0 ? (
                          <tr><td colSpan={8} className="text-center py-10 text-gray-400">Không có dữ liệu</td></tr>
                        ) : (
                          products.map((item) => (
                            <tr key={item.id}>
                                <td><span className="font-bold text-indigo-600">{item.id}</span></td>
                                <td className="font-semibold">{item.name}</td>
                                <td><span className="badge-status bg-gray text-gray-600">{item.category}</span></td>
                                <td>{item.unit_in}</td>
                                <td>{item.unit_out}</td>
                                <td><span className="text-green-dark font-bold">{item.conversion}</span> {item.unit_out}</td>
                                <td><div className="barcode">||||||||||| {item.id}</div></td>
                                <td>
                                    <div className="flex gap-2">
                                      <button className="btn-icon text-indigo-500 hover:bg-indigo-50"><i className="fa-solid fa-qrcode"></i></button>
                                      <button className="btn-icon text-gray-500 hover:bg-gray-100"><i className="fa-solid fa-pen"></i></button>
                                    </div>
                                </td>
                            </tr>
                          ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
  );
}
