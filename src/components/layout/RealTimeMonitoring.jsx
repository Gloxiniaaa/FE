const RealTimeMonitoring = ({ label, value, unit, limit, onChange, onSave }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-farmGray-600">{label}</h3>
      <p className="text-3xl font-bold text-farmGreen-700">
        {value} {unit}
      </p>
      <div className="text-sm font-medium text-farmGray-600 mb-2">optimal range:</div>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="number"
          value={limit.limit_down || ""}
          onChange={(e) => onChange({ limit_down: e.target.value })}
          className="border px-2 py-1 w-20 rounded text-sm"
        />
        <span>-</span>
        <input
          type="number"
          value={limit.limit_up || ""}
          onChange={(e) => onChange({ limit_up: e.target.value })}
          className="border px-2 py-1 w-20 rounded text-sm"
        />
        <span>{unit}</span>
      </div>
      <button
        onClick={onSave}
        className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
      >
        Lưu
      </button>
    </div>
  );
};

export default RealTimeMonitoring;