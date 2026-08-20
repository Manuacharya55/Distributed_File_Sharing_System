import React from 'react';
import { Link } from 'react-router-dom';

const FloatingIcon = ({ label, color, style, icon }) => (
  <div
    className="absolute flex flex-col items-center gap-1 animate-float select-none"
    style={style}
  >
    <div className={`w-14 h-16 ${color} rounded-lg shadow-lg flex flex-col items-end justify-end p-1.5 relative`}>
      <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-white/30 rounded-sm" />
      {icon}
      <span className="text-white font-black text-[10px] tracking-widest">{label}</span>
    </div>
  </div>
);

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#1a0a1e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Left decorative panel — hidden on small screens */}
      <div className="hidden lg:flex relative w-[420px] h-[600px] flex-col items-center justify-center flex-shrink-0 mr-8">
        {/* Glowing orb */}
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-600/40 to-purple-900/60 blur-2xl" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#2a0a2e] to-[#1a0520] border border-pink-500/30 shadow-[0_0_60px_rgba(236,72,153,0.3)] flex items-center justify-center">
            {/* Lightning bolt */}
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path
                d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"
                fill="url(#bolt)"
                stroke="rgba(236,72,153,0.6)"
                strokeWidth="0.5"
              />
              <defs>
                <linearGradient id="bolt" x1="4" y1="3" x2="13" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f472b6" />
                  <stop offset="1" stopColor="#9333ea" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Glow ring */}
          <div className="absolute inset-[-12px] rounded-full border border-pink-500/20" />
          <div className="absolute inset-[-24px] rounded-full border border-pink-500/10" />
          {/* Platform glow */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-pink-500/40 rounded-full blur-xl" />
        </div>

        {/* Floating file icons */}
        <FloatingIcon label="PDF" color="bg-gradient-to-br from-red-500 to-red-700" style={{ top: '6%', left: '18%', animationDelay: '0s' }} icon={<span className="text-white/80 text-[8px]">PDF</span>} />
        <FloatingIcon label="ZIP" color="bg-gradient-to-br from-blue-500 to-blue-700" style={{ top: '8%', right: '12%', animationDelay: '0.5s' }} icon={<span className="text-white/80 text-[8px]">ZIP</span>} />
        <FloatingIcon label="XLSX" color="bg-gradient-to-br from-green-500 to-green-700" style={{ bottom: '8%', right: '8%', animationDelay: '1s' }} icon={<span className="text-white/80 text-[8px]">XLS</span>} />
        <FloatingIcon label="" color="bg-gradient-to-br from-yellow-400 to-orange-500" style={{ bottom: '18%', left: '8%', animationDelay: '1.5s' }} icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" opacity="0.7"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
        } />
        <FloatingIcon label="" color="bg-gradient-to-br from-purple-500 to-purple-700" style={{ top: '38%', left: '2%', animationDelay: '0.8s' }} icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" opacity="0.7"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
        } />
        <div className="absolute top-40 right-4 animate-float" style={{ animationDelay: '1.2s' }}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" /></svg>
          </div>
        </div>

        {/* Connection dots */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-pink-500/60"
            style={{
              top: `${20 + i * 10}%`,
              left: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Auth card */}
      <div className="w-full max-w-[400px] bg-[#1e0d24]/80 backdrop-blur-xl border border-pink-500/20 rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.15)] p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center shadow-[0_0_12px_rgba(236,72,153,0.5)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" fill="white" />
            </svg>
          </div>
          <span className="text-white font-black text-lg tracking-wider uppercase">ShareFlow</span>
        </div>

        {children}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(-2deg); }
          66% { transform: translateY(-4px) rotate(2deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
