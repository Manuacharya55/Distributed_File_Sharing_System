import React from 'react';

const RecentActivity = ({ recentActivity }) => {
  return (
    <div className="bg-white border-4 border-black shadow-[12px_12px_0_0_#000]">
      <div className="px-8 py-6 border-b-4 border-black flex items-center justify-between bg-[#00FF00]">
        <h2 className="text-2xl font-black uppercase text-black">
          Recent Activity
        </h2>
        <span className="font-bold bg-white border-2 border-black px-4 py-1 uppercase shadow-[4px_4px_0_0_#000]">
          Latest Events
        </span>
      </div>
      
      {recentActivity && recentActivity.length > 0 ? (
        <div className="divide-y-4 divide-black">
          {recentActivity.map((event) => (
            <div key={event.id} className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center gap-6">
                <div className="w-4 h-4 bg-black rounded-full shadow-[2px_2px_0_0_#FF90E8]"></div>
                <div className="text-lg font-bold">
                  <span className="text-black uppercase bg-yellow-200 px-2 py-1 border-2 border-black mr-2">{event.action}</span>
                  <span className="text-gray-800 underline decoration-4 decoration-[#FF90E8]">{event.item}</span>
                </div>
              </div>
              <span className="text-sm font-black text-gray-500 uppercase mt-2 md:mt-0 bg-gray-200 px-3 py-1 border-2 border-black">
                {new Date(event.time).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-8 py-12 text-center text-xl font-bold uppercase text-gray-500">
          No recent activity found.
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
