import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#f8f9fa] p-10 relative overflow-hidden font-sans">
      
      <div className="relative z-10 flex flex-col items-center max-w-2xl text-center bg-white border-4 border-black p-16 shadow-[12px_12px_0_0_#FF90E8] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0_0_#FFC900] transition-all duration-300">
        
        <div className="text-xl font-black text-black uppercase mb-6 bg-yellow-300 px-6 py-2 border-4 border-black shadow-[4px_4px_0_0_#000] -rotate-2">
          Oops! Error detected.
        </div>

        <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter mb-4 text-black uppercase leading-none drop-shadow-[8px_8px_0_rgba(0,0,0,1)] rotate-2">
          404
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-black mb-8 text-black uppercase bg-[#00FF00] border-4 border-black px-6 py-2 shadow-[6px_6px_0_0_#000] -rotate-1 mt-4">
          Page Not Found
        </h2>
        
        <p className="text-lg font-bold text-gray-800 mb-12 max-w-md border-l-4 border-black pl-6 text-left bg-gray-100 p-4 shadow-[4px_4px_0_0_#000]">
          Looks like this file got lost in the void. Don't worry, it happens to the best of us. Let's get you back.
        </p>
        
        <Link 
          to="/" 
          className="px-10 py-5 bg-[#FFC900] text-black border-4 border-black font-black text-2xl uppercase shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_0_#000] active:shadow-none active:translate-y-[8px] active:translate-x-[8px] transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
