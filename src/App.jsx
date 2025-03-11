import React from "react";
import Home from "./pages/Home";

function App() {
  return <Home></Home>
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Hello, Tailwind CSS!</h1>
      <p className="mt-4 text-lg text-gray-700">
        Đây là một dự án React với Tailwind CSS.
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
        Nhấn vào đây
      </button>
    </div>
  );
}

export default App;
