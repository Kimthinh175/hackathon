"use client";
import React, { useEffect, useState } from "react";

export default function StockCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/hackathon/back-end/stock-card')
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
    <section id="stock-card" className="view-section animate-fade-in">
        <div className="page-header">
            <h2>Thẻ kho (Stock Card) - Truy vết lịch sử</h2>
            <div className="search-box p-1 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                <select className="px-4 py-2 rounded-lg border-none outline-none text-sm font-medium bg-gray-50">
                    <option>Kho A</option>
                    <option>Kho B</option>
                </select>
                <div className="h-6 w-[1px] bg-gray-200"></div>
                <input type="text" className="px-4 py-2 rounded-lg border-none outline-none text-sm w-64" placeholder="Nhập mã hàng (VD: SP001)" />
                <button className="btn btn-primary !py-2 !px-6">Xem Thẻ Kho</button>
            </div>
        </div>
        <div className="card">
            <div className="card-header flex justify-between items-center p-6 bg-gray-50/50">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {loading ? "Đang tải tên hàng..." : `Thẻ kho: ${data?.product?.id} - ${data?.product?.name}`}
                    </h3>
                    <p className="text-sm mt-1 text-gray-500">
                      {loading ? "..." : `Từ ${data?.period?.start} đến ${data?.period?.end}`}
                    </p>
                </div>
                <div className="stock-summary flex gap-8">
                    <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
                      <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Tồn đầu kỳ</span>
                      <strong className="text-lg">{loading ? "..." : data?.summary?.opening} <span className="text-sm font-normal text-gray-400">Thùng</span></strong>
                    </div>
                    <div className="bg-indigo-600 px-6 py-3 rounded-xl shadow-md text-white">
                      <span className="block text-xs font-bold text-indigo-200 uppercase mb-1">Tồn cuối kỳ</span>
                      <strong className="text-xl">{loading ? "..." : data?.summary?.closing} <span className="text-sm font-normal text-indigo-300">Thùng</span></strong>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
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
                      {loading ? (
                        <tr><td colSpan={7} className="text-center py-10 text-gray-400">Đang tải lịch sử thẻ kho...</td></tr>
                      ) : data?.history?.length > 0 ? (
                        data.history.map((row: any, idx: number) => (
                          <tr key={idx}>
                              <td>{row.date}</td>
                              <td><span className={row.ref !== '-' ? 'font-bold text-indigo-600' : ''}>{row.ref}</span></td>
                              <td>{row.desc}</td>
                              <td className="text-green font-bold">{row.in > 0 ? `+${row.in}` : '-'}</td>
                              <td className={row.out > 0 ? 'text-red font-bold' : ''}>{row.out > 0 ? `-${row.out}` : '-'}</td>
                              <td><strong>{row.balance}</strong></td>
                              <td><span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">{row.user}</span></td>
                          </tr>
                        ))
                      ) : <tr><td colSpan={7} className="text-center py-10 text-gray-400">Không có dữ liệu phát sinh</td></tr>}
                  </tbody>
              </table>
            </div>
        </div>
    </section>
  );
}
