import React from 'react';
import { useParams, Link } from 'react-router-dom';

const FolderDetailsPage = () => {
  const { folderId } = useParams();

  const folderNames = {
    '1': 'Work Projects',
    '2': 'Personal',
    '3': 'Design Assets',
    '4': 'Financials 2026',
    '5': 'Vacation Photos',
    '6': 'Code Backups'
  };
  
  const folderName = folderNames[folderId] || 'Unknown Folder';

  const dummyFiles = [
    { id: 'f1', name: 'logo-final.png', type: 'image', size: '2.4 MB', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&auto=format&fit=crop&q=60', color: 'bg-[#FF90E8]' },
    { id: 'f2', name: 'Q3_Report.pdf', type: 'document', size: '1.1 MB', color: 'bg-white' },
    { id: 'f3', name: 'team_meeting.jpg', type: 'image', size: '4.5 MB', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60', color: 'bg-[#00FF00]' },
    { id: 'f4', name: 'notes.txt', type: 'document', size: '12 KB', color: 'bg-white' },
    { id: 'f5', name: 'banner_ad.png', type: 'image', size: '3.8 MB', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop&q=60', color: 'bg-[#FFC900]' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-500">
      
      {/* Breadcrumb / Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link to="/folders" className="inline-flex items-center text-sm font-black tracking-widest text-black hover:bg-[#FFC900] border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0_0_#000] px-4 py-2 transition-all mb-6 group uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Folders
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase mb-1">
                {folderName}
              </h1>
              <p className="text-sm font-bold bg-[#FF90E8] border-2 border-black inline-block px-3 py-1 shadow-[2px_2px_0_0_#000] uppercase">
                {dummyFiles.length} items
              </p>
            </div>
          </div>
        </div>
        
        <button className="inline-flex items-center justify-center px-8 py-4 bg-[#00FF00] text-black border-4 border-black font-black uppercase text-xl shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#000] active:shadow-none active:translate-y-[6px] active:translate-x-[6px] transition-all gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload File
        </button>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {dummyFiles.map((file) => (
          <div key={file.id} className={`group ${file.color} border-4 border-black p-4 flex flex-col shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#000] active:shadow-none active:translate-y-[6px] active:translate-x-[6px] transition-all`}>
            <div className="aspect-square w-full bg-white border-4 border-black mb-4 overflow-hidden relative flex items-center justify-center group-hover:scale-[1.02] transition-transform">
              {file.type === 'image' && file.url ? (
                <img src={file.url} alt={file.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300" />
              ) : (
                <div className="text-black transition-colors duration-300 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              {/* Overlay for action */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button className="bg-[#FFC900] text-black font-black uppercase text-sm border-2 border-black px-4 py-2 hover:scale-110 hover:-rotate-3 transition-transform shadow-[4px_4px_0_0_#000]">
                  View
                </button>
              </div>
            </div>
            
            <h3 className="text-sm font-black text-black truncate mb-2">{file.name}</h3>
            <div className="flex items-center justify-between mt-auto border-t-2 border-black pt-2">
              <p className="text-[10px] font-bold text-black uppercase bg-white border-2 border-black px-1.5 shadow-[2px_2px_0_0_#000]">{file.type}</p>
              <p className="text-[10px] font-black text-black">{file.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderDetailsPage;
