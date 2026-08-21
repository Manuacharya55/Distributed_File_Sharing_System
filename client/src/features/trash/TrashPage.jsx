import React, { useState } from 'react';
import { getRequest, patchRequest, deleteRequest } from '../../api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, RotateCcw, Folder, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import PendingState from '../../components/shared/PendingState';
import ErrorState from '../../components/shared/ErrorState';
import EmptyState from '../../components/shared/EmptyState';
import ConfirmModal from '../../components/shared/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const fetchTrashItems = async () => {
  const res = await getRequest('/folder/trash');
  return res.data;
};

const TrashPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [emptyTrashConfirm, setEmptyTrashConfirm] = useState(false);
  const [itemToPermanentDelete, setItemToPermanentDelete] = useState(null); // { id, type: 'file' | 'folder' }
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['trash'],
    queryFn: fetchTrashItems,
  });

  const handleRestoreFile = async (fileId) => {
    setIsProcessing(true);
    try {
      await patchRequest(`/file/${fileId}/restore`, {});
      toast.success('File restored successfully!');
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (err) {
      toast.error(err.message || 'Failed to restore file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!itemToPermanentDelete) return;

    setIsProcessing(true);
    try {
      if (itemToPermanentDelete.type === 'file') {
        await deleteRequest(`/file/${itemToPermanentDelete.id}/permanent`);
      }
      toast.success('Item permanently deleted');
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (err) {
      toast.error(err.message || 'Failed to permanently delete item.');
    } finally {
      setIsProcessing(false);
      setItemToPermanentDelete(null);
    }
  };

  const handleEmptyTrash = async () => {
    setIsProcessing(true);
    try {
      await deleteRequest('/folder/trash/empty');
      toast.success('Trash emptied successfully!');
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (err) {
      toast.error(err.message || 'Failed to empty trash.');
    } finally {
      setIsProcessing(false);
      setEmptyTrashConfirm(false);
    }
  };

  if (isPending) {
    return (
      <PendingState title="Trash Bin" subtitle="Loading deleted items...">
        <div className="flex justify-center p-12">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      </PendingState>
    );
  }

  if (isError) {
    return <ErrorState message={error?.message} />;
  }

  const folders = data?.folders || [];
  const files = data?.files || [];
  const totalItems = folders.length + files.length;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-4 border-black">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-400 border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0_0_#000]">
              <Trash2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Trash Bin</h1>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase mt-2">
            Items in trash are scheduled for automatic purge after 30 days
          </p>
        </div>

        {totalItems > 0 && (
          <button
            onClick={() => setEmptyTrashConfirm(true)}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white border-3 border-black font-black uppercase text-sm shadow-[4px_4px_0_0_#000] hover:bg-red-600 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 stroke-[3]" />
            Empty Trash ({totalItems})
          </button>
        )}
      </div>

      {totalItems === 0 ? (
        <EmptyState message="Trash is empty! No deleted files or folders." />
      ) : (
        <div className="space-y-12">
          {/* Folders in Trash */}
          {folders.length > 0 && (
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Deleted Folders ({folders.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {folders.map((folder) => (
                  <div 
                    key={folder._id} 
                    className="bg-white border-4 border-black p-5 shadow-[6px_6px_0_0_#000] flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 border-2 border-black flex items-center justify-center shrink-0">
                        <Folder className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-black text-base uppercase truncate" title={folder.name}>
                          {folder.name}
                        </h3>
                        <span className="text-[10px] text-gray-500 font-bold block">
                          Deleted: {folder.deletedAt ? new Date(folder.deletedAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t-2 border-gray-200 flex justify-end">
                      <span className="text-xs font-bold text-gray-400 italic">Cascade Purge Queued</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files in Trash */}
          {files.length > 0 && (
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Deleted Files ({files.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {files.map((file) => (
                  <div 
                    key={file._id} 
                    className="bg-white border-4 border-black p-5 shadow-[6px_6px_0_0_#000] flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#FF90E8] border-2 border-black flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-black text-sm uppercase truncate" title={file.originalName}>
                          {file.originalName}
                        </h3>
                        <span className="text-[10px] font-bold bg-gray-100 border border-black px-1.5 py-0.5 inline-block mt-1">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t-2 border-black flex justify-between items-center gap-2">
                      <button
                        onClick={() => handleRestoreFile(file._id)}
                        disabled={isProcessing}
                        className="p-1.5 bg-[#00FF00] border-2 border-black text-black font-black text-xs uppercase shadow-[2px_2px_0_0_#000] hover:bg-green-400 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Restore File"
                      >
                        <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Restore</span>
                      </button>

                      <button
                        onClick={() => setItemToPermanentDelete({ id: file._id, type: 'file' })}
                        disabled={isProcessing}
                        className="p-1.5 bg-red-500 border-2 border-black text-white font-black text-xs uppercase shadow-[2px_2px_0_0_#000] hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Permanently Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Purge</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty Trash Confirm Modal */}
      <ConfirmModal
        isOpen={emptyTrashConfirm}
        title="Empty Trash Bin"
        message="Are you sure you want to permanently delete all items in trash? This cannot be undone and files will be permanently purged from AWS S3."
        onConfirm={handleEmptyTrash}
        onCancel={() => setEmptyTrashConfirm(false)}
      />

      {/* Single Item Permanent Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!itemToPermanentDelete}
        title="Permanently Purge Item"
        message="This action will permanently delete this item and free up your cloud storage quota. It cannot be recovered."
        onConfirm={handlePermanentDelete}
        onCancel={() => setItemToPermanentDelete(null)}
      />
    </div>
  );
};

export default TrashPage;
