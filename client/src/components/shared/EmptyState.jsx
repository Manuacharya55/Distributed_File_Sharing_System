const EmptyState = ({ message = "No data found." }) => {
  return (
    <div className="text-3xl font-black uppercase text-center mt-20 p-12 bg-white border-4 border-black shadow-[12px_12px_0_0_#000]">
      {message}
    </div>
  );
};

export default EmptyState;
