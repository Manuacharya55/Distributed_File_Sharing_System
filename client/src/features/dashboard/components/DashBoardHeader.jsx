import React from 'react';

const DashBoardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
      <div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase mb-4 hover:-rotate-1 transition-transform">
          Dashboard
        </h1>
        <p className="text-xl font-bold bg-[#FFC900] border-2 border-black px-4 py-2 shadow-[4px_4px_0_0_#000] inline-block">
          Your files, but cooler.
        </p>
      </div>
    </div>
  );
};

export default DashBoardHeader;
