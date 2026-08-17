import React, { useState, useEffect } from 'react';
import { getRequest } from '../../api/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({ stats: null, recentActivity: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getRequest('/dashboard');
        if (response && response.data) {
          setDashboardData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 text-3xl font-black uppercase text-center mt-20 animate-pulse">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 text-2xl font-bold uppercase text-white bg-red-500 border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">{error}</div>;
  }

  const { stats, recentActivity } = dashboardData;

  const statsDisplay = [
    { label: 'Total Files', count: stats?.totalFiles || 0, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-[#FF90E8]' },
    { label: 'Folders', count: stats?.totalFolders || 0, icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', color: 'bg-[#FFC900]' },
    { label: 'Images', count: stats?.totalImages || 0, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-[#8A2BE2]' },
    { label: 'Documents', count: stats?.totalDocuments || 0, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-[#00FF00]' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase mb-4 hover:-rotate-1 transition-transform">
            Dashboard
          </h1>
          <p className="text-xl font-bold bg-[#FFC900] border-2 border-black px-4 py-2 shadow-[4px_4px_0_0_#000] inline-block">
            Your files, but cooler.
          </p>
        </div>
        {/* Upload button removed as requested */}
      </div>

      {/* Stats Grid */}
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

      {/* Recent Activity Section */}
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

    </div>
  );
};

export default Dashboard;
