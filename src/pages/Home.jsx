import React from "react";
import farmImage from "../assets/images/grape-farm.png"; // Placeholder for hero image
import wateringIcon from "../assets/images/watering-icon.png"; // Placeholder for watering icon
import lightIcon from "../assets/images/light-icon.png"; // Placeholder for light icon
import sensorIcon from "../assets/images/sensor-icon.png"; // Placeholder for sensor icon
import Footer from "../components/layout/Footer";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <img src={icon} alt={`${title} Icon`} className="w-16 h-16 mr-4" />
      <div>
        <h3 className="text-xl font-bold text-green-700">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Section */}
      <section className="relative bg-green-900 text-white">
        <img
          src={farmImage}
          alt="Grape Farm"
          className="w-full h-[350px] object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl font-bold mb-4">FARMGENIUS GRAPEGROW</h1>
          <p className="text-xl max-w-2xl">
            Real-time monitoring of your grape farm's automated systems. Stay
            informed about watering, lighting, and more—powered by hardware
            data.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">
          Monitor Your Farm Effortlessly
        </h2>
        <div className="grid grid-cols-3 gap-8">
          <FeatureCard
            icon={wateringIcon}
            title="Automatic Watering"
            description="Track soil moisture levels and watering schedules in real time."
          />
          <FeatureCard
            icon={lightIcon}
            title="Light Control"
            description="Monitor and adjust lighting conditions based on sunlight data."
          />
          <FeatureCard
            icon={sensorIcon}
            title="Data Sensors"
            description="Get insights on temperature, humidity, and soil conditions directly from your farm."
          />
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 bg-gray-200 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          Live Dashboard
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          Get instant insights into your farm's performance with our intuitive
          dashboard, updated with real-time data from your hardware.
        </p>
        <div className="bg-white p-4 rounded-lg shadow-lg inline-block">
          <div className="w-[800px] h-[400px] bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">
              [Placeholder: Dashboard Screenshot]
            </span>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </div>
  );
};

export default Home;
