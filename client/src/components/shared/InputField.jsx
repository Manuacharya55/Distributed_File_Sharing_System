const InputField = ({ placeholder, name, register, errors, type = "text" }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full p-3 border-4 focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-shadow bg-[#f8f9fa] text-black font-medium
          ${
            errors
              ? "border-red-500"
              : "border-black"
          }
        `}
      />
      {errors && (
        <span className="text-red-500 font-bold text-sm uppercase">{errors.message}</span>
      )}
    </div>
  );
};

export default InputField;
