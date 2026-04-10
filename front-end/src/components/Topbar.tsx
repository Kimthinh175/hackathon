"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Topbar({ userRole }: { userRole: string }) {
  const router = useRouter();
  const [alertCount, setAlertCount] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch('/hackathon/api/alerts')
      .then(res => res.json())
      .then(data => {
        const count = (data?.minMax?.length || 0) + (data?.fefo?.length || 0);
        setAlertCount(count);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-search">
        <i className="fa-solid fa-magnifying-glass text-muted"></i>
        <input type="text" placeholder="Tìm kiếm hàng hóa, mã vạch..." />
      </div>
      
      <div className="topbar-actions">
        <div className="action-btn">
          <i className="fa-solid fa-bell"></i>
          {alertCount > 0 && <span className="badge animate-pulse">{alertCount}</span>}
        </div>
        <div className="action-btn">
          <i className="fa-solid fa-circle-question"></i>
        </div>
        
        <div className="user-profile relative cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="text-right mr-3 hidden md:block">
             <p className="text-xs font-bold text-main uppercase leading-tight">{userRole === 'Manager' ? 'Tài khoản Quản lý' : 'Tài khoản Nhân viên'}</p>
             <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-lg border-2 border-white shadow-lg overflow-hidden transition hover:scale-110">
            <img 
               src={`https://ui-avatars.com/api/?name=${userRole}+User&background=4318FF&color=fff`} 
               alt="Avatar"
               className="w-full h-full object-cover"
            />
          </div>
          
          {/* Dropdown Menu */}
          {showDropdown && (
             <div className="absolute top-12 right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
                <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="font-bold text-sm text-gray-800">{userRole} User</p>
                    <p className="text-xs text-gray-500">{userRole.toLowerCase()}@waremax.vn</p>
                </div>
                <div className="p-1">
                    <button className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors">
                        <i className="fa-solid fa-user-gear"></i> Cài đặt tài khoản
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); router.push('/'); }} 
                        className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                    </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </header>
  );
}
