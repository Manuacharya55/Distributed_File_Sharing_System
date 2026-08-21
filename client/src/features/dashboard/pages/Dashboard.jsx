import { getRequest } from '../../../api/api';
import { DashboardShimmer } from '../../../components/shared/Loader';
import DashBoardHeader from '../components/DashBoardHeader';
import DashBoardGrid from '../components/DashBoardGrid';
import RecentActivity from '../components/RecentActivity';
import StorageWidget from '../components/StorageWidget';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import PendingState from '../../../components/shared/PendingState';
import ErrorState from '../../../components/shared/ErrorState';
import { FileText, Folder, Image, FileCode } from 'lucide-react';

const Dashboard = () => {
  const fetchDashboardDetails = async () => {
    const response = await getRequest('/dashboard');
    return response.data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardDetails,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

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
    { label: 'Total Files', count: stats?.totalFiles || 0, icon: FileText, color: 'bg-[#FF90E8]' },
    { label: 'Folders', count: stats?.totalFolders || 0, icon: Folder, color: 'bg-[#FFC900]' },
    { label: 'Images', count: stats?.totalImages || 0, icon: Image, color: 'bg-[#8A2BE2]' },
    { label: 'Documents', count: stats?.totalDocuments || 0, icon: FileCode, color: 'bg-[#00FF00]' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-500">
      <DashBoardHeader />
      <StorageWidget usedBytes={stats?.usedStorage || 0} limitBytes={stats?.storageLimit || 1073741824} />
      <DashBoardGrid statsDisplay={statsDisplay} />
      <RecentActivity recentActivity={recentActivity} />
    </div>
  );
};

export default Dashboard;
