import React from 'react';

const DashBoardGrid = ({ statsDisplay }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {statsDisplay.map((stat, index) => (
        <div key={index} className="bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#000] active:shadow-none active:translate-y-[8px] active:translate-x-[8px] transition-all relative group cursor-default">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 ${stat.color} border-2 border-black flex items-center justify-center text-black shadow-[4px_4px_0_0_#000] group-hover:-rotate-12 transition-transform`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-6xl font-black text-black tracking-tighter mb-2">{stat.count}</p>
            <p className="text-lg font-bold text-gray-700 uppercase">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashBoardGrid;
