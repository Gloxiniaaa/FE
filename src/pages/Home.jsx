import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import farmImage from "../assets/images/grape-farm.png"; // Placeholder for hero image
import wateringIcon from "../assets/images/watering-icon.png"; // Placeholder for watering icon
import lightIcon from "../assets/images/light-icon.png"; // Placeholder for light icon
import sensorIcon from "../assets/images/sensor-icon.png"; // Placeholder for sensor icon
import Footer from "../components/layout/Footer";
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <img src={icon} alt={`${title} Icon`} className="w-16 h-16 mr-4" />
      <div>
        <h3 className="text-xl font-bold text-farmGreen-700">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const Home = () => {
  const FEED_MAP = {
    'farmgenius-grapegrow.bbc-temp': 'temperature',
    'farmgenius-grapegrow.bbc-humidity': 'humidity',
    'farmgenius-grapegrow.bbc-soil': 'soilMoisture',
    'farmgenius-grapegrow.bbc-light': 'light',
    'farmgenius-grapegrow.bbc-pump': 'pump',
    'farmgenius-grapegrow.bbc-led': 'led',
  };
  
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const handleStartNow = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };
  
  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
      console.log('Socket connected in Home');
    });

    socket.on('new-data', ({ feed, value }) => {
      const key = FEED_MAP[feed];
      if (key) {
        setData((prev) => ({
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
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected in Home');
    });

    // Clean up the socket connection
    return () => {
      socket.off('new-data');
      socket.off('notification');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Section */}
      <section className="relative bg-farmGreen-900 text-white">
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

      {/* Start Now Button */}
      <div className="text-center py-8">
        <button
          onClick={handleStartNow}
          className="inline-block bg-farmGreen-700 text-white py-4 px-10 rounded-lg text-2xl hover:bg-farmGreen-900 transition-colors duration-200"
        >
          Start Now
        </button>
      </div>

      {/* Features Section */}
      <section className="pb-8 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">
          Monitor Your Farm Effortlessly With
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
        <div className="bg-white p-6 rounded-lg shadow-lg inline-block w-[800px]">
          <div className="grid grid-cols-3 gap-4 text-left">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-100 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-700">{key}</h4>
                <p className="text-2xl text-green-600">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer></Footer>
    </div>
  );
};

export default Home;