import React, { useState, useEffect } from 'react';
import { getRequest } from '../../../api/api';
import { DashboardShimmer } from '../../../components/shared/Loader';
import DashBoardHeader from '../components/DashBoardHeader';
import DashBoardGrid from '../components/DashBoardGrid';
import RecentActivity from '../components/RecentActivity';

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
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase mb-4">
              Dashboard
            </h1>
            <p className="text-xl font-bold bg-[#FFC900] border-2 border-black px-4 py-2 shadow-[4px_4px_0_0_#000] inline-block text-transparent">
              Loading...
            </p>
          </div>
        </div>
        <DashboardShimmer />
      </div>
    );
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
      <DashBoardHeader />
      <DashBoardGrid statsDisplay={statsDisplay} />
      <RecentActivity recentActivity={recentActivity} />
    </div>
  );
};

export default Dashboard;
