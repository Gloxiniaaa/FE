import { useState, useEffect } from 'react';
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
  return Object.values(grouped)
  .sort((a, b) => b.time.localeCompare(a.time));
};

const Table = ({ data }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedDate, setSelectedDate] = useState(null);
	
	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		setSelectedDate(today);
	}, []);

	useEffect(() => {
		setCurrentPage(1);
	}, [selectedDate]);	
	
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

	const tableData = combineSensorData(filteredData);
	const filteredTableData = tableData.filter(
		(row) => row.led !== undefined || row.pump !== undefined
	);

	const itemsPerPage = 8;
	const totalPages = Math.ceil(filteredTableData.length / itemsPerPage);
	const paginatedtable = filteredTableData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);


  return (
    <section className="max-w-6xl mx-auto mb-12">
      <h2 className="text-2xl font-semibold text-farmGreen-700 mb-4">
        Bảng dữ liệu cảm biến & thiết bị
      </h2>
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
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-collapse border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Thời gian</th>
              <th className="border p-2">LED (%)</th>
              <th className="border p-2">PUMP (%)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedtable.map((row, i) => (
              <tr key={i} className="even:bg-gray-50">
                <td className="border p-2">{row.time}</td>
                <td className="border p-2">{row.led ?? '-'}</td>
                <td className="border p-2">{row.pump ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

				{/* Pagination Controls */}
				<div className="flex justify-center gap-2">
					<button
						onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
						disabled={currentPage === 1}
						className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
					>
						Trang trước
					</button>
					<span className="px-3 py-1 text-farmGreen-700 font-semibold">
						{totalPages === 0 ? 0 : currentPage} / {totalPages}
					</span>
					<button
						onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
						disabled={currentPage === totalPages}
						className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
					>
						Trang sau
					</button>
				</div>
      </div>
    </section>
  );
};

export default Table;