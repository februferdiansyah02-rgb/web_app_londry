import React, { useState } from 'react';
import { apiLogin } from '../api';

export default function Login({ onNavigateToRegister, onNavigateToForgotPassword, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('Pelanggan');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiLogin(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLoginSuccess?.(data);
    } catch (err) {
      setError(err.message || 'Login gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">

        {/* Bagian Logo */}
        <div className="flex justify-center items-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-[14px] flex items-center justify-center mr-3 shadow-lg shadow-blue-200">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4z M4 8h16 M12 16a4 4 0 100-8 4 4 0 000 8z" />
             </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B254D] tracking-tight">
            <span className="text-blue-500">My</span>Laundry
          </h1>
        </div>

        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl w-full">
          <div className="bg-gray-50 rounded-2xl p-1.5 flex justify-between items-center mb-6">
            <button 
              onClick={() => setActiveTab('Pelanggan')}
              className={`flex-1 py-2 rounded-xl text-sm transition-all ${activeTab === 'Pelanggan' ? 'bg-white text-blue-600 font-bold shadow-sm' : 'text-gray-500 font-semibold hover:text-gray-700'}`}>Pelanggan</button>
            <button 
              onClick={() => setActiveTab('Mitra Laundry')}
              className={`flex-1 py-2 rounded-xl text-sm transition-all ${activeTab === 'Mitra Laundry' ? 'bg-white text-blue-600 font-bold shadow-sm' : 'text-gray-500 font-semibold hover:text-gray-700'}`}>Mitra Laundry</button>
            <button 
              onClick={() => setActiveTab('Admin')}
              className={`flex-1 py-2 rounded-xl text-sm transition-all ${activeTab === 'Admin' ? 'bg-white text-blue-600 font-bold shadow-sm' : 'text-gray-500 font-semibold hover:text-gray-700'}`}>Admin</button>
          </div>

          <div className="border-b border-gray-100 mb-6"></div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Login sebagai {activeTab}
            </h2>

            <div className="mb-4">
              <label htmlFor="email" className="block text-[13px] font-bold text-[#334155] mb-2">Email</label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400"
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
              className={`w-full font-bold py-3.5 rounded-xl transition duration-200 mb-6 text-[15px] ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#007AFF] hover:bg-blue-600 text-white shadow-md shadow-blue-200/50'}`}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Belum punya akun?{' '}
            <button 
              onClick={onNavigateToRegister} 
              className="font-bold text-[#007AFF] hover:text-blue-700 transition-colors"
            >
              Daftar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
