import dotenv from "dotenv";
dotenv.config();

const config = {
  HOST: import.meta.env.VITE_HOST,
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
};

export default config;
