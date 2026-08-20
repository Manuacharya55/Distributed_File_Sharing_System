const PendingState = ({ title = "Dashboard", subtitle = "Loading...", children }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase mb-4">
            {title}
          </h1>
          <p className="text-xl font-bold bg-[#FFC900] border-2 border-black px-4 py-2 shadow-[4px_4px_0_0_#000] inline-block text-black">
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default PendingState;
