"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = userRole === 'Manager' ? '/manager' : '/staff';

  const menuItems = [
    { name: 'Trang chủ', icon: 'fa-house', path: '' },
    { name: 'Danh sách hàng', icon: 'fa-boxes-stacked', path: '/master-data' },
    { name: 'Nhập / Xuất hàng', icon: 'fa-truck-ramp-box', path: '/inventory' },
    { name: 'Quản lý đồ dùng', icon: 'fa-toolbox', path: '/assets' },
    { name: 'Hàng sắp hết / Hết hạn', icon: 'fa-triangle-exclamation', path: '/alerts' },
    { name: 'Lịch sử hàng hóa', icon: 'fa-clock-rotate-left', path: '/stock-card' },
    { name: 'Vị trí kho hàng', icon: 'fa-map-location-dot', path: '/bin-location' },
    { name: 'Xem báo cáo', icon: 'fa-chart-line', path: '/reports' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <i className="fa-solid fa-boxes-packing"></i>
        </div>
        <h2>WareMax</h2>
        <span className="role-badge">{userRole}</span>
      </div>
      
      <nav className="nav-menu">
        {menuItems.map((item) => {
          const itemPath = `${basePath}${item.path}`;
          // Handle dashboard active state
          const isActive = item.path === '' 
            ? (pathname === basePath || pathname === `${basePath}/`)
            : pathname.startsWith(itemPath);

          return (
            <Link 
              key={item.name} 
              href={itemPath} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-gray-100 pb-4">
        <button 
           onClick={() => router.push('/')} 
           className="nav-item text-rose-500 hover:bg-rose-50 transition-colors w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold"
        >
           <i className="fa-solid fa-right-from-bracket"></i>
           <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
