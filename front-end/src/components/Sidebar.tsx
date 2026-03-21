"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ roleBasePath }: { roleBasePath: string }) {
  const pathname = usePathname() || "";

  const isActive = (path: string) => {
    return pathname.includes(path) ? "active" : "";
  };

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header border-b border-indigo-700/30 pb-4 mb-4">
        <i className="fa-solid fa-boxes-stacked logo-icon text-3xl mb-2"></i>
        <h2 className="text-xl font-bold tracking-wider">WareMax</h2>
        <div className="text-xs text-indigo-200 mt-1 uppercase tracking-widest">{roleBasePath === '/manager' ? 'MANAGER' : 'STAFF'}</div>
      </div>
      <nav className="nav-menu flex flex-col gap-2">
        <a href={`/hackathon${roleBasePath}`} onClick={(e) => handleNav(e, `/hackathon${roleBasePath}`)} className={`nav-item p-3 flex items-center gap-3 rounded-lg hover:bg-white/10 transition ${isActive(roleBasePath) && pathname === roleBasePath ? 'bg-white/20 font-bold' : ''}`}>
          <i className="fa-solid fa-chart-pie w-5 text-center"></i>
          <span>Tổng quan</span>
        </a>
        <a href={`/hackathon${roleBasePath}/master-data`} onClick={(e) => handleNav(e, `/hackathon${roleBasePath}/master-data`)} className={`nav-item p-3 flex items-center gap-3 rounded-lg hover:bg-white/10 transition ${isActive('/master-data') ? 'bg-white/20 font-bold' : ''}`}>
          <i className="fa-solid fa-database w-5 text-center"></i>
          <span>Danh mục Hàng hóa</span>
        </a>
        <a href={`/hackathon${roleBasePath}/inventory`} onClick={(e) => handleNav(e, `/hackathon${roleBasePath}/inventory`)} className={`nav-item p-3 flex items-center gap-3 rounded-lg hover:bg-white/10 transition ${isActive('/inventory') ? 'bg-white/20 font-bold' : ''}`}>
          <i className="fa-solid fa-dolly w-5 text-center"></i>
          <span>Quản lý Kho</span>
        </a>
        <a href={`/hackathon${roleBasePath}/assets`} onClick={(e) => handleNav(e, `/hackathon${roleBasePath}/assets`)} className={`nav-item p-3 flex items-center gap-3 rounded-lg hover:bg-white/10 transition ${isActive('/assets') ? 'bg-white/20 font-bold' : ''}`}>
          <i className="fa-solid fa-laptop-code w-5 text-center"></i>
          <span>Quản lý Tài sản</span>
        </a>
        <a href={`/hackathon${roleBasePath}/alerts`} onClick={(e) => handleNav(e, `/hackathon${roleBasePath}/alerts`)} className={`nav-item p-3 flex items-center gap-3 rounded-lg hover:bg-white/10 transition ${isActive('/alerts') ? 'bg-white/20 font-bold' : ''}`}>
          <i className="fa-solid fa-bell w-5 text-center"></i>
          <span>Cảnh báo Tồn kho</span>
        </a>
        <a href={`/hackathon${roleBasePath}/stock-card`} onClick={(e) => handleNav(e, `/hackathon${roleBasePath}/stock-card`)} className={`nav-item p-3 flex items-center gap-3 rounded-lg hover:bg-white/10 transition ${isActive('/stock-card') ? 'bg-white/20 font-bold' : ''}`}>
          <i className="fa-solid fa-money-check-dollar w-5 text-center"></i>
          <span>Thẻ kho</span>
        </a>
        <a href={`/hackathon${roleBasePath}/bin-location`} onClick={(e) => handleNav(e, `/hackathon${roleBasePath}/bin-location`)} className={`nav-item p-3 flex items-center gap-3 rounded-lg hover:bg-white/10 transition ${isActive('/bin-location') ? 'bg-white/20 font-bold' : ''}`}>
          <i className="fa-solid fa-map-location-dot w-5 text-center"></i>
          <span>Vị trí kho</span>
        </a>
        <a href={`/hackathon${roleBasePath}/reports`} onClick={(e) => handleNav(e, `/hackathon${roleBasePath}/reports`)} className={`nav-item p-3 flex items-center gap-3 rounded-lg hover:bg-white/10 transition ${isActive('/reports') ? 'bg-white/20 font-bold' : ''}`}>
          <i className="fa-solid fa-chart-line w-5 text-center"></i>
          <span>Báo cáo Kho</span>
        </a>
      </nav>
      
      <div className="mt-auto pt-8">
         <a href="/hackathon/" onClick={(e) => handleNav(e, '/hackathon/')} className="nav-item p-3 flex items-center gap-3 rounded-lg hover:bg-red-500/20 text-red-200 transition">
          <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
          <span>Đăng xuất</span>
        </a>
      </div>
    </aside>
  );
}
