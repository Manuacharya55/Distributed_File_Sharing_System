import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRequest } from '../../api/api';
import { Download, Eye, FileText, AlertCircle, Loader2, ArrowLeft, Globe } from 'lucide-react';
import FilePreviewModal from '../files/components/FilePreviewModal';

const SharedResourcePage = () => {
  const { shareToken } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    const fetchSharedFile = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getRequest(`/share/access/${shareToken}`);
        if (res && res.data && res.data.file) {
          setFile(res.data.file);
        } else {
          setError('File not available.');
        }
      } catch (err) {
        setError(err.message || 'This link is private, invalid, or sharing has been disabled by the owner.');
      } finally {
        setLoading(false);
      }
    };

    if (shareToken) {
      fetchSharedFile();
    }
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f9fa]">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] flex items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin stroke-[2.5]" />
          <span className="font-black text-xl uppercase">Loading Shared File...</span>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f9fa]">
        <div className="bg-white border-4 border-black p-8 md:p-10 shadow-[12px_12px_0_0_#000] max-w-md text-center">
          <div className="w-16 h-16 bg-red-400 border-3 border-black mx-auto mb-4 flex items-center justify-center shadow-[4px_4px_0_0_#000]">
            <AlertCircle className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black uppercase mb-2">Link Inactive</h2>
          <p className="text-sm font-bold text-gray-600 mb-6 leading-relaxed">
            {error || 'This link is private or has been disabled by the owner.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0_0_#FF90E8] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Go to ShareFlow
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f9fa]">
      <div className="w-full max-w-3xl animate-in fade-in duration-300">
        <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0_0_#000]">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b-4 border-black mb-8">
            <Link to="/" className="text-xl md:text-2xl font-black uppercase tracking-tight">
              SHARE<span className="bg-black text-white px-1.5 py-0.5 ml-1 border-2 border-black">FLOW</span>
            </Link>
            <span className="text-xs font-black uppercase bg-[#00FF00] border-2 border-black px-3 py-1 shadow-[2px_2px_0_0_#000] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Shared File
            </span>
          </div>

          {/* Main Info */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-28 h-28 bg-[#FF90E8] border-4 border-black flex items-center justify-center shrink-0 shadow-[6px_6px_0_0_#000]">
              <FileText className="w-14 h-14 stroke-[2.5]" />
            </div>
            <div className="overflow-hidden text-center md:text-left flex-1">
              <span className="text-xs font-black bg-black text-white px-2 py-0.5 uppercase mb-2 inline-block">
                {file.extension || 'FILE'}
              </span>
              <h1 className="text-2xl md:text-4xl font-black uppercase truncate mb-2" title={file.originalName}>
                {file.originalName}
              </h1>
              <p className="text-sm font-bold text-gray-600 uppercase">
                Size: {(file.size / 1024).toFixed(1)} KB • Shared via ShareFlow
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-4 border-black">
            <button
              onClick={() => setPreviewFile(file)}
              className="flex-1 py-4 px-6 bg-white border-3 border-black font-black uppercase text-sm shadow-[4px_4px_0_0_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-5 h-5 stroke-[2.5]" />
              Preview in Browser
            </button>

            <a
              href={file.downloadUrl || file.previewUrl}
              download={file.originalName}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-4 px-6 bg-[#00FF00] border-3 border-black font-black uppercase text-sm shadow-[4px_4px_0_0_#000] hover:bg-green-400 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-black cursor-pointer"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              Download File
            </a>
          </div>
        </div>

        {/* Modal for In-Browser Preview */}
        <FilePreviewModal
          file={previewFile}
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      </div>
    </div>
  );
};

export default SharedResourcePage;
