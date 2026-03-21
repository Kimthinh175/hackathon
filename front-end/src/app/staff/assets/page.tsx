"use client";
import React, { useEffect, useState } from "react";

export default function Assets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/hackathon/back-end/assets')
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setAssets(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const getStatusClass = (status: string) => {
    if (status === 'Đang sử dụng') return 'bg-green text-green-dark';
    if (status === 'Lưu kho') return 'bg-gray text-gray-dark';
    if (status === 'Sửa chữa') return 'bg-orange text-orange-dark';
    return 'bg-gray text-gray-500';
  };

  return (
    <section id="assets" className="view-section animate-fade-in">
        <div className="page-header">
            <h2>Quản lý Tài sản (Asset)</h2>
            <button className="btn btn-primary"><i className="fa-solid fa-hand-holding"></i> Cấp phát mới</button>
        </div>
        <div className="card">
            <div className="card-header">
                <h3>Lịch sử Cấp phát & Thu hồi - Khấu hao</h3>
            </div>
            <div className="table-responsive">
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
                      {loading ? (
                        <tr><td colSpan={8} className="text-center py-10 text-gray-400">Đang tải...</td></tr>
                      ) : assets.length === 0 ? (
                        <tr><td colSpan={8} className="text-center py-10 text-gray-400">Không có dữ liệu</td></tr>
                      ) : (
                        assets.map((item) => (
                          <tr key={item.id}>
                              <td><span className="font-bold text-indigo-600">{item.id}</span></td>
                              <td className="font-semibold">{item.name}</td>
                              <td><span className={`badge-status ${getStatusClass(item.status)}`}>{item.status}</span></td>
                              <td className="text-sm text-gray-600">{item.user}</td>
                              <td className="font-medium">{item.original_price.toLocaleString()}đ</td>
                              <td><span className="text-red-500">{item.depreciation}</span></td>
                              <td className="font-bold text-green-dark">{item.residual_value.toLocaleString()}đ</td>
                              <td><button className={`btn btn-sm ${item.status === 'Đang sử dụng' ? 'btn-outline' : 'btn-primary'}`}>
                                {item.status === 'Đang sử dụng' ? 'Thu hồi' : 'Cấp phát'}
                              </button></td>
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
