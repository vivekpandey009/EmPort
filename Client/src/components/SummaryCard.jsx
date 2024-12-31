const SummaryCard = ({ icon, text, number, bgColor }) => {
  return (
    <div className="flex bg-white rounded">
      <div
        className={`flex items-center justify-center px-4 text-3xl text-white font-Grotesk ${bgColor}`}
      >
        {icon}
      </div>

      <div className="py-1 pl-4">
        <p className="text-lg font-semibold font-Grotesk">{text}</p>
        <p className="font-bold text-x1 font-Grotesk">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
