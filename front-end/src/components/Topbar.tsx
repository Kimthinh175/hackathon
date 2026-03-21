import React from 'react';

export default function Topbar({ userRole }: { userRole: string }) {
  return (
    <header className="topbar flex justify-between items-center bg-white shadow-sm px-6 py-4 border-b border-gray-100">
      <div className="search-bar flex items-center bg-gray-50 rounded-lg px-4 py-2 w-96 border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 transition">
        <i className="fa-solid fa-magnifying-glass text-gray-400 mr-3"></i>
        <input 
            type="text" 
            placeholder="Tìm kiếm hàng hóa, mã vạch..." 
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700" 
        />
      </div>
      <div className="topbar-actions flex items-center gap-6">
        <div className="action-btn relative cursor-pointer hover:text-indigo-600 transition">
          <i className="fa-solid fa-bell text-xl text-gray-500"></i>
          <span className="badge absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">3</span>
        </div>
        <div className="user-profile group relative flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
          <img 
            src={`https://ui-avatars.com/api/?name=${userRole}+User&background=4318FF&color=fff`} 
            alt="User" 
            className="w-10 h-10 rounded-full shadow-sm"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800 capitalize">{userRole}</span>
            <span className="text-xs text-green-500 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online</span>
          </div>

          {/* Biểu mẫu Dropdown khi Hover (Profile Menu) */}
          <div className="absolute top-14 right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right scale-95 group-hover:scale-100">
            <div className="p-2 border-b border-gray-50">
               <span className="block text-[10px] text-gray-400 font-bold px-2 pb-1 uppercase tracking-wider">Tài khoản</span>
               <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition">
                  <i className="fa-regular fa-user w-4"></i> Hồ sơ cá nhân
               </a>
               <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition">
                  <i className="fa-solid fa-gear w-4"></i> Cài đặt hệ thống
               </a>
            </div>
            <div className="p-2">
               <a href="/hackathon/" className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-lg transition">
                  <i className="fa-solid fa-right-from-bracket w-4"></i> Đăng xuất ngay
               </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
