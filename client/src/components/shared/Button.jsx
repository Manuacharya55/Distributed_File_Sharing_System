const Button = ({ name, isProcessing, handleClick, type = "submit" }) => {
  return (
    <button type={type} className='w-full mt-4 bg-black text-white p-2 rounded-sm' onClick={handleClick}>
        {isProcessing ? "Processing..." : name}
    </button>
  )
}

export default Button
