import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/layout/Footer";
import NavigationBar from "../components/layout/NavigationBar";
import debounce from "lodash/debounce";
import RealTimeMonitoring from "../components/layout/RealTimeMonitoring";
import Graph from "../components/layout/Graph";
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const FEED_MAP = {
    'farmgenius-grapegrow.bbc-temp': 'temperature',
    'farmgenius-grapegrow.bbc-humidity': 'humidity',
    'farmgenius-grapegrow.bbc-soil': 'soilMoisture',
    'farmgenius-grapegrow.bbc-light': 'light',
    'farmgenius-grapegrow.bbc-pump': 'pump',
    'farmgenius-grapegrow.bbc-led': 'led',
  };
  
  const [sensorData, setSensorData] = useState({
      temperature: 0,
      humidity: 0,
      soilMoisture: 0,
      light: 0,
      pump: 0,
      led: 0,
  });
  

  const [limits, setLimits] = useState({
    temp: { limit_up: "", limit_down: "" },
    humid: { limit_up: "", limit_down: "" },
    soil: { limit_up: "", limit_down: "" },
    light: { limit_up: "", limit_down: "" },
  });
  
  // Device control states
  const [pumpStatus, setPumpStatus] = useState(false); // Water pump toggle
  const [lightStatus, setLightStatus] = useState(false); // Light toggle
  const [lightIntensity, setLightIntensity] = useState(35); // Light intensity (0-100%)
  const [pumpIntensity, setPumpIntensity] = useState(35); // PumpPump intensity (0-100%)
  const [graphData, setGraphData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const sendLevelToBackend = async (deviceType, level) => {
    try {
      await fetch(`${import.meta.env.VITE_HOST}/device/control`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ device: deviceType, level }),
      });
    } catch (error) {
      console.error(`Failed to update ${deviceType} intensity:`, error);
    }
  };

  // tạo debounce function
  const debouncedSendLevel = useCallback(
    debounce((deviceType, level) => {
      sendLevelToBackend(deviceType, level);
    }, 300),
    []
  );


  // Toggle handlers for active devicedevice
  const handleToggleDevice = async (deviceType, isOn, setStatus, intensity) => {
    const newStatus = !isOn;
    setStatus(newStatus);
  
    try {
      await fetch(`${import.meta.env.VITE_HOST}/device/control`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          device: deviceType,
          level: newStatus ? intensity : 0, // level = 0 nếu OFF
        }),
      });
    } catch (error) {
      console.error(`Failed to toggle ${deviceType}:`, error);
    }
  };

  const handleIntensityChange = (e, deviceType, setIntensity, isOn) => {
    const newIntensity = e.target.value;
    setIntensity(newIntensity);
    if (isOn) {
      debouncedSendLevel(deviceType, newIntensity);
    }
  };
  
  // Fetch limit data
  const fetchLimit = async (device) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST}/device/limited?device=${device}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Không thể lấy giới hạn");
      const data = await res.json();
      if (data.limit_up === undefined || data.limit_down === undefined) {
        console.warn(`Giới hạn không tồn tại cho device: ${device}`);
        return { limit_up: "", limit_down: "" };
      }

      return {
        limit_up: data.limit_up.toString(),
        limit_down: data.limit_down.toString(),
      };
    } catch (err) {
      console.error(`Lỗi khi lấy limit cho ${device}:`, err);
      return { limit_up: "", limit_down: "" }; // fallback an toàn
    }
  };
  
  // Fetch all limits
  const fetchAllLimits = async () => {
    const keys = ["temp", "humid", "soil", "light"];
    try {
      const fetched = await Promise.all(keys.map(fetchLimit));
      const newLimits = {};
      keys.forEach((key, idx) => {
        newLimits[key] = fetched[idx];
      });
      setLimits(newLimits);
    } catch (err) {
      console.error("Error fetching all limits:", err);
    }
  };

  // Fetch graph data
  const fetchGraphData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_HOST}/device/graph`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu biểu đồ");

      const data = await res.json();
      setGraphData(data);
    } catch (err) {
      console.error("Graph API error:", err);
    }
  };

  // Fetch sensor data from socket
  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
      console.log('Socket connected in Dashboard');
    });

    socket.on('new-data', ({ feed, value }) => {
      const key = FEED_MAP[feed];
      if (key) {
        setSensorData((prev) => ({
          ...prev,
          [key]: value,
        }));
      }
    });

    socket.on('notification', (payload) => {
      let message = '';
      if (payload.noti) {
        message = payload.noti;
      } else if (payload.feed && payload.value !== undefined) {
        const key = FEED_MAP[payload.feed] || payload.feed;
        message = `⚠️ ${key} = ${payload.value} vượt giới hạn!`;
      }

      if (message) {
        toast.warning(message, {
          position: 'top-right',
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
        });
      }

      setNotifications((prev) => [
        ...prev,
        {
          noti: payload.noti,
          feed: payload.feed,
          value: payload.value,
        },
      ]);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected in Dashboard');
    });

    fetchAllLimits();
    fetchGraphData();
    return () => {
      socket.off('new-data');
      socket.off('notification');
      socket.disconnect();
    };
  }, []);
  
  // Change limit
  const handleSendLimit = async (deviceKey) => {
    const { limit_up, limit_down } = limits[deviceKey];
  
    if (!limit_up || !limit_down || Number(limit_down) >= Number(limit_up)) {
      alert("Giới hạn không hợp lệ");
      return;
    }
  
    try {
      const res = await fetch(`${import.meta.env.VITE_HOST}/device/limited`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          device: deviceKey,
          limit_up: Number(limit_up),
          limit_down: Number(limit_down),
        }),
      });
  
      if (!res.ok) throw new Error("Cập nhật thất bại");
      alert(`Cập nhật giới hạn ${deviceKey} thành công`);
    } catch (err) {
      alert("Lỗi gửi giới hạn");
      console.error(err);
    }
  };

  
  return (
    <div className="min-h-screen bg-farmGray-100 flex flex-col">
      <NavigationBar></NavigationBar>

      {/* Main Dashboard Content */}
      <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-farmGreen-700 text-center mb-8">
          Dashboard
        </h1>

        {/* Real-Time Sensor Data */}
        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-farmGreen-700 mb-4">
            Real-Time Monitoring
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <RealTimeMonitoring
              label="Temperature"
              value={sensorData.temperature}
              unit="°C"
              limit={limits.temp}
              onChange={(val) =>
                setLimits({ ...limits, temp: { ...limits.temp, ...val } })
              }
              onSave={() => handleSendLimit("temp")}
            />
            <RealTimeMonitoring
              label="Humidity"
              value={sensorData.humidity}
              unit="%"
              limit={limits.humid}
              onChange={(val) =>
                setLimits({ ...limits, humid: { ...limits.humid, ...val } })
              }
              onSave={() => handleSendLimit("humid")}
            />
            <RealTimeMonitoring
              label="Soil Moisture"
              value={sensorData.soilMoisture}
              unit="%"
              limit={limits.soil}
              onChange={(val) =>
                setLimits({ ...limits, soil: { ...limits.soil, ...val } })
              }
              onSave={() => handleSendLimit("soil")}
            />
            <RealTimeMonitoring
              label="Light Intensity"
              value={sensorData.light}
              unit="lux"
              limit={limits.light}
              onChange={(val) =>
                setLimits({ ...limits, light: { ...limits.light, ...val } })
              }
              onSave={() => handleSendLimit("light")}
            />
          </div>

        </section>

        {/* Device Control */}
        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-farmGreen-700 mb-4">
            Device Control
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Water Pump Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-farmGray-600">
                    Water Pump
                  </h3>
                  <p className="text-farmGray-600">
                    Status: {pumpStatus ? "ON" : "OFF"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pumpStatus}
                    onChange={() =>
                      handleToggleDevice("pump", pumpStatus, setPumpStatus, pumpIntensity)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-farmGray-200 rounded-full peer peer-checked:bg-farmGreen-700 transition-colors duration-200"></div>
                  <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-0.5 peer-checked:translate-x-5 transition-transform duration-200"></div>
                </label>
              </div>  
              {/* PumpPump Intensity Slider */}
              {pumpStatus && (
                <div className="mt-4">
                  <label
                    htmlFor="pump-intensity"
                    className="block text-sm font-medium text-farmGray-600"
                  >
                    Pump Intensity ({pumpIntensity}%)
                  </label>
                  <input
                    id="pump-intensity"
                    type="range"
                    min="0"
                    max="100"
                    value={pumpIntensity}
                    onChange={(e) =>
                      handleIntensityChange(e, "pump", setPumpIntensity, pumpStatus)
                    }
                    className="w-full h-1 bg-farmGray-200 rounded-lg appearance-none cursor-pointer accent-farmGreen-700"
                  />
                </div>
              )}

            </div>

            {/* Light Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-farmGray-600">
                    Light
                  </h3>
                  <p className="text-farmGray-600">
                    Status: {lightStatus ? "ON" : "OFF"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lightStatus}
                    onChange={() =>
                      handleToggleDevice("led", lightStatus, setLightStatus, lightIntensity)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-farmGray-200 rounded-full peer peer-checked:bg-farmGreen-700 transition-colors duration-200"></div>
                  <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-0.5 peer-checked:translate-x-5 transition-transform duration-200"></div>
                </label>
              </div>
              {/* Light Intensity Slider */}
              {lightStatus && (
                <div className="mt-4">
                  <label
                    htmlFor="light-intensity"
                    className="block text-sm font-medium text-farmGray-600"
                  >
                    Light Intensity ({lightIntensity}%)
                  </label>
                  <input
                    id="light-intensity"
                    type="range"
                    min="0"
                    max="100"
                    value={lightIntensity}
                    onChange={(e) =>
                      handleIntensityChange(e, "led", setLightIntensity, lightStatus)
                    }
                    className="w-full h-1 bg-farmGray-200 rounded-lg appearance-none cursor-pointer accent-farmGreen-700"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Plant Health Placeholder */}
        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-farmGreen-700 mb-4">
            Plant Health
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Graph data={graphData} />
          </div>
        </section>

        {/* Notifications Placeholder */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-farmGreen-700 mb-4">
            Notifications
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            {notifications.length === 0 ? (
              <p>Không có thông báo nào.</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((notification, index) => (
                  <li key={index} className="p-3 rounded bg-gray-100 shadow">
                    {notification.noti ? (
                      <p>{notification.noti}</p>
                    ) : (
                      <p>
                        <strong>Feed:</strong> {notification.feed}, <strong>Value:</strong> {notification.value}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default Dashboard;
