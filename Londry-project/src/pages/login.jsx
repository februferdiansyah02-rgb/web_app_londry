import React, { useState } from 'react';
import { apiLogin } from '../api';

const ROLE_LABELS = {
  Pelanggan: { key: 'customer', label: 'Pelanggan', color: 'blue' },
  'Mitra Laundry': { key: 'outlet', label: 'Mitra Laundry', color: 'indigo' },
  Admin: { key: 'admin', label: 'Admin', color: 'slate' },
};

const ROLE_COLORS = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', ring: 'ring-blue-500', active: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600', textDark: 'text-blue-500' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', ring: 'ring-indigo-500', active: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-indigo-600', textDark: 'text-indigo-500' },
  slate: { bg: 'bg-slate-50', border: 'border-slate-200', ring: 'ring-slate-500', active: 'bg-slate-600', hover: 'hover:bg-slate-700', text: 'text-slate-600', textDark: 'text-slate-500' },
};

export default function Login({ onNavigateToRegister, onNavigateToForgotPassword, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('Pelanggan');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleConfig = ROLE_LABELS[activeTab];
  const colors = ROLE_COLORS[roleConfig.color];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi');
      setLoading(false);
      return;
    }

    try {
      const data = await apiLogin(email, password, roleConfig.key);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Kirim role yang dipilih agar App.jsx bisa arahkan ke dashboard yang sesuai.
      onLoginSuccess?.({ ...data, role: roleConfig.key });
    } catch (err) {
      setError(err.message || 'Login gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${colors.bg} flex items-center justify-center p-4 font-sans`}>
      <div className="w-full max-w-md">

        {/* Bagian Logo */}
        <div className="flex justify-center items-center mb-8">
          <div className={`w-12 h-12 ${colors.active === 'bg-blue-600' ? 'bg-blue-500' : colors.active === 'bg-indigo-600' ? 'bg-indigo-500' : 'bg-slate-500'} rounded-[14px] flex items-center justify-center mr-3 shadow-lg`}>
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4z M4 8h16 M12 16a4 4 0 100-8 4 4 0 000 8z" />
             </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B254D] tracking-tight">
            <span className={colors.textDark}>My</span>Laundry
          </h1>
        </div>

        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl w-full">
          <div className="bg-gray-50 rounded-2xl p-1.5 flex justify-between items-center mb-6">
            {Object.entries(ROLE_LABELS).map(([tab, info]) => {
              const c = ROLE_COLORS[info.color];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {info.label}
                </button>
              );
            })}
          </div>

          <div className="border-b border-gray-100 mb-6"></div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Login sebagai {roleConfig.label}
            </h2>

            <div className="mb-4">
              <label htmlFor="email" className="block text-[13px] font-bold text-[#334155] mb-2">Email</label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="nama@email.com"
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:${colors.ring} focus:border-transparent text-sm placeholder-gray-400`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-[13px] font-bold text-[#334155] mb-2">Kata sandi</label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Kata sandi"
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:${colors.ring} focus:border-transparent text-sm placeholder-gray-400`}
              />
            </div>

            <div className="flex items-center justify-between mt-5 mb-8">
              <label className="flex items-center text-sm text-gray-500 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-xs group-hover:text-gray-700">Ingat saya</span>
              </label>
              <button 
                onClick={onNavigateToForgotPassword} 
                className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
              >
                Lupa kata sandi?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3.5 rounded-xl transition duration-200 mb-6 text-[15px] ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : `${colors.active} ${colors.hover} text-white shadow-md shadow-${colors.text === 'text-blue-600' ? 'blue-200/50' : colors.text === 'text-indigo-600' ? 'indigo-200/50' : 'slate-200/50'}`}`}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Belum punya akun?{' '}
            <button 
              onClick={onNavigateToRegister} 
              className={`font-bold ${colors.textDark} hover:opacity-80 transition-colors`}
            >
              Daftar
            </button>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4">
            Pilih role yang sesuai dengan akun Anda sebelum masuk.
          </p>
        </div>
      </div>
    </div>
  );
}
