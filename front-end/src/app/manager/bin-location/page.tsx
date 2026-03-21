"use client";
import React from "react";

export default function BinLocation() {
  return (
    <section id="bin-location" className="view-section">
      <div className="page-header">
        <h2>Sơ đồ Vị trí kho (Bin Location)</h2>
      </div>
      <div className="card map-card">
        <div className="map-controls">
          <select><option>Khu vực A (Kệ sắt)</option></select>
          <div className="legend">
            <span className="dot dot-emp"></span> Trống
            <span className="dot dot-occ"></span> Có hàng
            <span className="dot dot-full"></span> Đầy
          </div>
        </div>
        <div className="warehouse-map">
          {/* Rack A */}
          <div className="rack">
            <div className="rack-title">Kệ A</div>
            <div className="tiers">
              <div className="tier">
                <span className="t-label">Tầng 3</span>
                <div className="bins">
                  <div className="bin status-empty" data-tip="A-3-1 (Trống)">A1</div>
                  <div className="bin status-occ" data-tip="A-3-2 (Chứa SP02)">A2</div>
                  <div className="bin status-full" data-tip="A-3-3 (Đầy)">A3</div>
                  <div className="bin status-full" data-tip="A-3-4 (Đầy)">A4</div>
                </div>
              </div>
              <div className="tier">
                <span className="t-label">Tầng 2</span>
                <div className="bins">
                  <div className="bin status-occ" data-tip="A-2-1 (Chứa SP01)">A1</div>
                  <div className="bin status-occ active-pick" data-tip="A-2-2 (SP05 - Cần pick!)">A2 <i className="fa-solid fa-hand-pointer blink"></i></div>
                  <div className="bin status-empty" data-tip="A-2-3 (Trống)">A3</div>
                  <div className="bin status-occ" data-tip="A-2-4 (Chứa SP07)">A4</div>
                </div>
              </div>
              <div className="tier border-b-0">
                <span className="t-label">Tầng 1</span>
                <div className="bins">
                  <div className="bin status-full">A1</div>
                  <div className="bin status-full">A2</div>
                  <div className="bin status-full">A3</div>
                  <div className="bin status-full">A4</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail View */}
          <div className="bin-detail">
            <h3>Thông tin Ô Kệ: <strong>A-Tầng 2-Ô 2</strong></h3>
            <p>Đang chứa:</p>
            <ul>
              <li><strong>SP05 - Sữa bột:</strong> 50 Hộp</li>
            </ul>
            <button className="btn btn-outline mt-2 w-full">Điều chuyển vị trí</button>
          </div>
        </div>
      </div>
    </section>

  );
}
