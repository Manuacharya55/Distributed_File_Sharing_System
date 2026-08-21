import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText, Image as ImageIcon, Video, Music, Code, AlertCircle, Loader2 } from 'lucide-react';

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  const [textContent, setTextContent] = useState(null);
  const [loadingText, setLoadingText] = useState(false);
  const [textError, setTextError] = useState(null);

  const previewUrl = file?.previewUrl || file?.fileUrl;
  const downloadUrl = file?.downloadUrl || file?.fileUrl;
  const fileName = file?.originalName || 'File Preview';
  const mimeType = file?.mimeType || '';
  const extension = (file?.extension || '').toLowerCase();

  const isImage = mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
  const isVideo = mimeType.startsWith('video/') || ['mp4', 'webm', 'ogg', 'mov'].includes(extension);
  const isAudio = mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'aac'].includes(extension);
  const isPdf = mimeType === 'application/pdf' || extension === 'pdf';
  const isText = mimeType.startsWith('text/') || 
    ['txt', 'json', 'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'md', 'csv', 'xml', 'log'].includes(extension) ||
    mimeType.includes('json') || mimeType.includes('javascript');

  useEffect(() => {
    if (isOpen && isText && previewUrl) {
      setLoadingText(true);
      setTextError(null);
      fetch(previewUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load text content");
          return res.text();
        })
        .then((data) => {
          setTextContent(data);
          setLoadingText(false);
        })
        .catch((err) => {
          setTextError(err.message);
          setLoadingText(false);
        });
    } else {
      setTextContent(null);
    }
  }, [isOpen, isText, previewUrl]);

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white border-4 border-black shadow-[12px_12px_0_0_#000] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#FF90E8] border-b-4 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="p-1.5 bg-black text-white border-2 border-black font-black uppercase text-xs">
              {extension.toUpperCase() || 'FILE'}
            </span>
            <h2 className="font-black text-lg md:text-xl uppercase truncate text-black" title={fileName}>
              {fileName}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={fileName}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 transition-all text-black"
                title="Download"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-[#FFC900] border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 transition-all text-black"
              title="Close"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 overflow-auto p-4 md:p-6 flex items-center justify-center bg-gray-50 min-h-[320px]">
          {isImage && (
            <div className="flex flex-col items-center justify-center max-h-[70vh] w-full">
              <img
                src={previewUrl}
                alt={fileName}
                className="max-h-[65vh] max-w-full object-contain border-4 border-black shadow-[6px_6px_0_0_#000] bg-white"
              />
            </div>
          )}

          {isPdf && (
            <iframe
              src={`${previewUrl}#toolbar=0`}
              title={fileName}
              className="w-full h-[70vh] border-4 border-black shadow-[6px_6px_0_0_#000] bg-white"
            />
          )}

          {isVideo && (
            <div className="w-full max-w-3xl border-4 border-black shadow-[6px_6px_0_0_#000] bg-black">
              <video controls className="w-full max-h-[65vh]" autoPlay>
                <source src={previewUrl} type={mimeType} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {isAudio && (
            <div className="w-full max-w-md p-6 bg-white border-4 border-black shadow-[6px_6px_0_0_#000] flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-[#FFC900] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000]">
                <Music className="w-10 h-10 stroke-[2.5]" />
              </div>
              <p className="font-bold text-center text-sm truncate w-full">{fileName}</p>
              <audio controls className="w-full mt-2">
                <source src={previewUrl} type={mimeType} />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}

          {isText && (
            <div className="w-full h-[65vh] bg-white border-4 border-black shadow-[6px_6px_0_0_#000] flex flex-col overflow-hidden">
              <div className="bg-gray-100 border-b-2 border-black px-4 py-2 text-xs font-mono font-bold flex justify-between items-center text-gray-700">
                <span>TEXT / CODE VIEWER</span>
                <span>{(file.size / 1024).toFixed(2)} KB</span>
              </div>
              <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed">
                {loadingText && (
                  <div className="flex items-center justify-center h-full gap-2 text-gray-600 font-bold">
                    <Loader2 className="w-6 h-6 animate-spin stroke-[2.5]" />
                    <span>Loading content...</span>
                  </div>
                )}
                {textError && (
                  <div className="flex items-center justify-center h-full gap-2 text-red-600 font-bold">
                    <AlertCircle className="w-6 h-6 stroke-[2.5]" />
                    <span>Failed to preview text: {textError}</span>
                  </div>
                )}
                {!loadingText && !textError && (
                  <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm text-black">
                    {textContent}
                  </pre>
                )}
              </div>
            </div>
          )}

          {!isImage && !isPdf && !isVideo && !isAudio && !isText && (
            <div className="text-center p-8 bg-white border-4 border-black shadow-[6px_6px_0_0_#000] max-w-md">
              <div className="w-16 h-16 bg-cyan-300 border-4 border-black mx-auto mb-4 flex items-center justify-center shadow-[4px_4px_0_0_#000]">
                <FileText className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="font-black text-lg uppercase mb-2">Preview Not Available</h3>
              <p className="text-sm font-medium text-gray-600 mb-6">
                This file format ({extension.toUpperCase()}) cannot be rendered directly in the browser. You can download it to view on your device.
              </p>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#00FF00] border-2 border-black px-6 py-2.5 font-black uppercase text-sm shadow-[4px_4px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all"
                >
                  <Download className="w-4 h-4 stroke-[3]" />
                  Download File
                </a>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t-4 border-black p-3 px-6 flex justify-between items-center text-xs font-bold uppercase text-gray-700">
          <div>Size: {(file.size / 1024).toFixed(2)} KB</div>
          <div>Uploaded: {new Date(file.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
