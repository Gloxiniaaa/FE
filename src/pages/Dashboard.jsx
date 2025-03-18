import React, { useState } from "react";
import Footer from "../components/layout/Footer";
import NavigationBar from "../components/layout/NavigationBar";

const Dashboard = () => {
  // Mock real-time data (replace with WebSocket/API later)
  const [sensorData, setSensorData] = useState({
    temperature: 25.3, // °C
    humidity: 65, // %
    soilMoisture: 45, // %
    light: 780, // lux
  });

  // Device control states
  const [pumpStatus, setPumpStatus] = useState(false); // Water pump toggle
  const [lightStatus, setLightStatus] = useState(false); // Light toggle
  const [lightIntensity, setLightIntensity] = useState(35); // Light intensity (0-100%)

  // Toggle handlers (replace with backend API calls later)
  const handlePumpToggle = () => {
    setPumpStatus(!pumpStatus);
    console.log("Water Pump turned", pumpStatus ? "OFF" : "ON");
    // Add API call to control relay here
  };

  const handleLightToggle = () => {
    setLightStatus(!lightStatus);
    console.log("Light turned", lightStatus ? "OFF" : "ON");
    // Add API call to control light relay here
  };

  // Slider handler for light intensity
  const handleLightIntensityChange = (e) => {
    const newIntensity = e.target.value;
    setLightIntensity(newIntensity);
    console.log("Light intensity set to", newIntensity, "%");
    // Add API call to adjust light intensity here
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
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-farmGray-600">
                Temperature
              </h3>
              <p className="text-3xl font-bold text-farmGreen-700">
                {sensorData.temperature} °C
              </p>
              <div className="text-sm font-medium text-farmGray-600">
                optimal range: 18-30 °C
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-farmGray-600">
                Humidity
              </h3>
              <p className="text-3xl font-bold text-farmGreen-700">
                {sensorData.humidity} %
              </p>
              <div className="text-sm font-medium text-farmGray-600">
                optimal range: 40-80 %
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-farmGray-600">
                Soil Moisture
              </h3>
              <p className="text-3xl font-bold text-farmGreen-700">
                {sensorData.soilMoisture} %
              </p>
              <div className="text-sm font-medium text-farmGray-600">
                optimal range: 30-70 %
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-farmGray-600">
                Light Intensity
              </h3>
              <p className="text-3xl font-bold text-farmGreen-700">
                {sensorData.light} lux
              </p>
              <div className="text-sm font-medium text-farmGray-600">
                optimal range: 500-1500 lux
              </div>
            </div>
          </div>
        </section>

        {/* Device Control */}
        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-farmGreen-700 mb-4">
            Device Control
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Water Pump Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
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
                  onChange={handlePumpToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-farmGray-200 rounded-full peer peer-checked:bg-farmGreen-700 transition-colors duration-200"></div>
                <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-0.5 peer-checked:translate-x-5 transition-transform duration-200"></div>
              </label>
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
                    onChange={handleLightToggle}
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
                    onChange={handleLightIntensityChange}
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
            <p className="text-farmGray-600">
              [Placeholder: YOLOv5 analysis results - charts and images]
            </p>
          </div>
        </section>

        {/* Notifications Placeholder */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-farmGreen-700 mb-4">
            Notifications
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-farmGray-600">
              [Placeholder: Alerts for pests, low humidity, etc.]
            </p>
          </div>
        </section>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default Dashboard;
