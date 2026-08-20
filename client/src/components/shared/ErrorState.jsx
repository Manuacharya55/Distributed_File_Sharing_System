const ErrorState = ({ message = "An error occurred" }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 text-2xl font-bold uppercase text-white bg-red-500 border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
      {message}
    </div>
  );
};

export default ErrorState;
