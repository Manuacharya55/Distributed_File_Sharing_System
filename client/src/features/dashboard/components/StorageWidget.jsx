import React from 'react';
import { HardDrive, AlertTriangle } from 'lucide-react';

const StorageWidget = ({ usedBytes = 0, limitBytes = 1073741824 }) => {
  const usedMB = (usedBytes / (1024 * 1024)).toFixed(1);
  const limitMB = (limitBytes / (1024 * 1024)).toFixed(0);
  const percentage = Math.min(100, Math.max(0, Math.round((usedBytes / limitBytes) * 100)));

  const getBarColor = () => {
    if (percentage > 85) return 'bg-red-500';
    if (percentage > 60) return 'bg-[#FFC900]';
    return 'bg-[#00FF00]';
  };

  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] mb-12 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-300 border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0_0_#000]">
            <HardDrive className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">Cloud Storage Quota</h3>
            <p className="text-xs font-bold text-gray-600 uppercase">1 GB Free Allocation Plan</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black">{usedMB} MB</span>
          <span className="text-sm font-bold text-gray-500"> / {limitMB} MB ({percentage}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 border-4 border-black h-7 p-0.5 shadow-inner">
        <div 
          className={`h-full ${getBarColor()} border-r-2 border-black transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {percentage > 90 && (
        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-red-600">
          <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span>Storage almost full. Move old files to Trash or empty your trash bin.</span>
        </div>
      )}
    </div>
  );
};

export default StorageWidget;
