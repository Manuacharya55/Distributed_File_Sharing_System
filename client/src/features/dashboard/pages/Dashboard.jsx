import { getRequest } from '../../../api/api';
import { DashboardShimmer } from '../../../components/shared/Loader';
import DashBoardHeader from '../components/DashBoardHeader';
import DashBoardGrid from '../components/DashBoardGrid';
import RecentActivity from '../components/RecentActivity';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import PendingState from '../../../components/shared/PendingState';
import ErrorState from '../../../components/shared/ErrorState';

const Dashboard = () => {

  const fetchDashboardDetails = async()=>{
    const response = await getRequest('/dashboard');
    if(!response.success){
      throw new Error(response.message)
    }
    return response.data;
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardDetails,
    placeholderData : keepPreviousData,
    staleTime : 60 * 1000
  })


  if (isPending) {
    return (
      <PendingState title="Dashboard" subtitle="Loading...">
        <DashboardShimmer />
      </PendingState>
    );
  }

  if (isError) {
    return <ErrorState message={error?.message} />;
  }

  const { stats, recentActivity } = data;

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
