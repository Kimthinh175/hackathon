"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/hackathon/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.user.role === 'Manager') {
          router.push('/manager');
        } else {
          router.push('/staff');
        }
      } else {
        setError(data.error || 'Đăng nhập thất bại.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Không thể kết nối đến máy chủ.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F4F7FE' }}>
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4318FF 0%, #6941C6 50%, #9E77ED 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(-30%, 30%)' }}></div>

        <div className="relative z-10 text-center text-white">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <i className="fa-solid fa-boxes-packing text-5xl"></i>
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">WareMax</h1>
          <p className="text-xl font-medium opacity-80 mb-12">Hệ thống Quản lý Kho & Tài sản</p>

          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { icon: 'fa-boxes-stacked', label: 'Quản lý Kho', sub: 'Multi-location' },
              { icon: 'fa-chart-line', label: 'Báo cáo AI', sub: 'Smart Forecast' },
              { icon: 'fa-bell', label: 'Cảnh báo', sub: 'Real-time' },
            ].map((f) => (
              <div key={f.label} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                <i className={`fa-solid ${f.icon} text-2xl mb-2 block`}></i>
                <p className="font-bold text-sm">{f.label}</p>
                <p className="text-xs opacity-70">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#4318FF' }}>
              <i className="fa-solid fa-boxes-packing text-3xl text-white"></i>
            </div>
            <h1 className="text-2xl font-black" style={{ color: '#1B2559' }}>WareMax</h1>
          </div>

          <div className="bg-white rounded-3xl p-10" style={{ boxShadow: '0px 20px 60px rgba(67, 24, 255, 0.1)', border: '1px solid rgba(224, 229, 242, 0.6)' }}>
            <div className="mb-8">
              <h2 className="text-3xl font-black" style={{ color: '#1B2559' }}>Xin chào! 👋</h2>
              <p className="mt-2 text-sm font-medium" style={{ color: '#A3AED0' }}>Đăng nhập để tiếp tục quản lý kho hàng</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation text-lg shrink-0"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-black tracking-widest uppercase mb-2" style={{ color: '#A3AED0' }}>
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#A3AED0' }}></i>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="admin / staff"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl border text-sm font-semibold outline-none transition-all"
                    style={{
                      border: '1.5px solid #E0E5F2',
                      color: '#1B2559',
                      background: '#FAFCFF',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4318FF'}
                    onBlur={(e) => e.target.style.borderColor = '#E0E5F2'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black tracking-widest uppercase mb-2" style={{ color: '#A3AED0' }}>
                  Mật khẩu
                </label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#A3AED0' }}></i>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-4 rounded-2xl border text-sm font-semibold outline-none transition-all"
                    style={{
                      border: '1.5px solid #E0E5F2',
                      color: '#1B2559',
                      background: '#FAFCFF',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4318FF'}
                    onBlur={(e) => e.target.style.borderColor = '#E0E5F2'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm transition-colors"
                    style={{ color: '#A3AED0' }}
                  >
                    <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl text-white font-black text-sm tracking-wide transition-all mt-2"
                style={{
                  background: loading ? '#A3AED0' : 'linear-gradient(135deg, #4318FF, #6941C6)',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(67, 24, 255, 0.35)',
                  cursor: loading ? 'wait' : 'pointer',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Đăng nhập ngay <i className="fa-solid fa-arrow-right"></i>
                  </span>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs font-medium" style={{ color: '#A3AED0' }}>
              WareMax v1.0 &nbsp;•&nbsp; Hackathon 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
