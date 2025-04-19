import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const combineSensorData = (data) => {
  const grouped = {};
  Object.keys(data).forEach((device) => {
    data[device].forEach(({ timestamp, value }) => {
      const key = formatTimestamp(timestamp);
      if (!grouped[key]) grouped[key] = { time: key };
      grouped[key][device] = value;
    });
  });
  return Object.values(grouped).sort((a, b) => a.time.localeCompare(b.time));
};

const Graph = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const isSameDay = (timestamp, selectedDate) => {
    const ts = new Date(timestamp);
    const sd = new Date(selectedDate);
    return ts.toDateString() === sd.toDateString();
  };

  const filteredData = {};
  Object.entries(data || {}).forEach(([device, readings]) => {
    filteredData[device] = (readings || []).filter((r) =>
      selectedDate ? isSameDay(r.timestamp, selectedDate) : true
    );
  });

  const combinedData = combineSensorData(filteredData);

  return (
    <section className="max-w-6xl mx-auto mb-12">
      <h2 className="text-2xl font-semibold text-farmGreen-700 mb-4">Biểu đồ cảm biến</h2>

      {/* Chọn ngày */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Chọn ngày:</label>
        <input
          type="date"
          value={selectedDate || ""}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <Tooltip
              labelFormatter={(label) => `Thời gian: ${label}`}
            />
            <XAxis dataKey="time" 
              tickFormatter={(label) => label.split(",")[1] || label} 
              interval={Math.ceil(combinedData.length / 8)}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temp" stroke="#f97316" name="Temp (°C)" />
            <Line type="monotone" dataKey="humid" stroke="#3b82f6" name="Humidity (%)" />
            <Line type="monotone" dataKey="soil" stroke="#22c55e" name="Soil (%)" />
            <Line type="monotone" dataKey="light" stroke="#eab308" name="Light (lux)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default Graph;