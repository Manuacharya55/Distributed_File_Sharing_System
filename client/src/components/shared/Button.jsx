const Button = ({ name, isProcessing, handleClick, type = "submit", className = "" }) => {
  return (
    <button
      type={type}
      disabled={isProcessing}
      onClick={handleClick}
      className={`w-full py-3.5 px-6 font-black uppercase tracking-wider text-base bg-black text-white hover:bg-[#FF90E8] hover:text-black border-4 border-black transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${className}`}
    >
      {isProcessing ? (
        <>
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        name
      )}
    </button>
  );
};

export default Button;
