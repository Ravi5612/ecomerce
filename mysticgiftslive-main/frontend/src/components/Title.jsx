const Title = ({ text1, text2 }) => {
  return (
    <div className="flex flex-col items-center mb-3">
      <p className="text-gray-500 text-xl sm:text-2xl md:text-3xl">
        {text1} <span className="text-gray-700 font-medium">{text2}</span>
      </p>
      <div className="w-12 sm:w-16 h-[2px] bg-gray-700 mt-2" />
    </div>
  );
};

export default Title;