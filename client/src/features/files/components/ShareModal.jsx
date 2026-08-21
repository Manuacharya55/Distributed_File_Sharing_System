import React, { useState } from 'react';
import { X, Copy, Check, Globe, Lock, Share2, Loader2, Link2 } from 'lucide-react';
import { patchRequest } from '../../../api/api';
import { useToast } from '../../../context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';

const ShareModal = ({ file, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [isShareable, setIsShareable] = useState(file?.isShareable || false);
  const [shareToken, setShareToken] = useState(file?.shareToken || null);
  const [isToggling, setIsToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state if file prop changes
  React.useEffect(() => {
    if (file) {
      setIsShareable(file.isShareable || false);
      setShareToken(file.shareToken || null);
      setCopied(false);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const fileName = file.originalName || 'File';
  const shareUrl = shareToken ? `${window.location.origin}/share/${shareToken}` : '';

  const handleToggleShare = async () => {
    if (isToggling) return;
    setIsToggling(true);

    try {
      const res = await patchRequest(`/share/file/${file._id}/toggle`, {
        isShareable: !isShareable
      });

      if (res && res.data) {
        setIsShareable(res.data.isShareable);
        setShareToken(res.data.shareToken);
        toast.success(res.message || (res.data.isShareable ? 'Link sharing enabled' : 'Link sharing disabled'));

        // Update local file object and invalidate queries
        file.isShareable = res.data.isShareable;
        file.shareToken = res.data.shareToken;
        queryClient.invalidateQueries({ queryKey: ['files'] });
        queryClient.invalidateQueries({ queryKey: ['folderDetails'] });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to toggle link sharing');
    } finally {
      setIsToggling(false);
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Public link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white border-4 border-black shadow-[12px_12px_0_0_#000] w-full max-w-md flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FFC900] border-b-4 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-6 h-6 stroke-[2.5]" />
            <h2 className="font-black text-lg uppercase">Link Sharing</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all text-black cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* File Card Info */}
          <div className="p-3 bg-gray-50 border-2 border-black flex items-center gap-3">
            <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-1">
              {file.extension || 'FILE'}
            </span>
            <div className="font-black text-sm uppercase truncate flex-1" title={fileName}>
              {fileName}
            </div>
          </div>

          {/* Toggle Switch (MEGA style) */}
          <div className="flex items-center justify-between p-4 bg-[#f8f9fa] border-3 border-black shadow-[4px_4px_0_0_#000]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 border-2 border-black flex items-center justify-center ${isShareable ? 'bg-[#00FF00]' : 'bg-gray-300'}`}>
                {isShareable ? <Globe className="w-5 h-5 stroke-[2.5]" /> : <Lock className="w-5 h-5 stroke-[2.5]" />}
              </div>
              <div>
                <h4 className="font-black text-sm uppercase">Public Link</h4>
                <p className="text-xs font-bold text-gray-500">
                  {isShareable ? 'Anyone with link can view' : 'Only you have access'}
                </p>
              </div>
            </div>

            {/* Neo-brutalist Toggle button */}
            <button
              onClick={handleToggleShare}
              disabled={isToggling}
              className={`relative inline-flex h-8 w-14 items-center border-2 border-black transition-colors focus:outline-none cursor-pointer disabled:opacity-50 ${isShareable ? 'bg-black' : 'bg-gray-200'}`}
              title="Toggle public link"
            >
              {isToggling ? (
                <Loader2 className="w-4 h-4 mx-auto animate-spin text-white" />
              ) : (
                <span
                  className={`inline-block h-6 w-6 transform border-2 border-black bg-white transition-transform ${isShareable ? 'translate-x-6 bg-[#00FF00]' : 'translate-x-1'}`}
                />
              )}
            </button>
          </div>

          {/* Link Display when Active */}
          {isShareable && shareUrl && (
            <div className="space-y-3 animate-in fade-in">
              <label className="block text-xs font-black uppercase text-gray-700">
                Shareable URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 p-2.5 bg-gray-100 border-2 border-black font-mono text-xs truncate focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-[#FF90E8] border-2 border-black shadow-[3px_3px_0_0_#000] hover:bg-pink-300 active:translate-x-0.5 active:translate-y-0.5 transition-all text-black flex items-center gap-1.5 font-black text-xs uppercase cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5" />
                No login required. Recipient gets direct in-browser preview and download.
              </p>
            </div>
          )}

          {!isShareable && (
            <p className="text-xs font-bold text-gray-400 text-center py-2">
              Toggle the switch above to generate a shareable public link.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
