"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  if (isLoginPage) return null;

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-md flex items-center justify-between z-40 relative">
      <div className="flex gap-8 items-center">
          <Link href="/" className="font-extrabold text-2xl tracking-tight">WarehouseApp</Link>
          <div className="hidden md:flex gap-6">
              <Link href="/manager" className="text-indigo-100 hover:text-white transition font-medium">Dashboard Quản Lý</Link>
              <Link href="/staff" className="text-indigo-100 hover:text-white transition font-medium">Dashboard Nhân Viên</Link>
          </div>
      </div>
      <div className="flex items-center gap-4">
          <span className="text-sm bg-indigo-800 py-1 px-3 rounded-full opacity-90 border border-indigo-500">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block mr-2 animate-pulse"></span>
              {pathname?.includes('/manager') ? 'Quản lý' : 'Nhân viên'}
          </span>
          <Link href="/" className="text-sm text-indigo-200 hover:text-white transition-colors bg-indigo-700/50 px-3 py-1 rounded-full"><i className="fa-solid fa-right-from-bracket"></i> Đăng xuất</Link>
      </div>
    </nav>
  );
}
