const InputField = ({ placeholder, name, register, errors, type = "text" }) => {
  return (
    <div className="flex flex-col gap-1">
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full px-4 mt-2 py-2.5 rounded border bg-transparent text-sm outline-none transition-colors
          ${
            errors
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-black"
          }
        `}
      />
      {errors && (
        <span className="text-red-500 text-xs">{errors.message}</span>
      )}
    </div>
  );
};

export default InputField;
