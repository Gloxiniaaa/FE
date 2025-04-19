import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      alert("Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Lỗi không xác định";
      alert(`Đăng xuất thất bại: ${message}`);
    }
  };

  return (
    <nav className="bg-farmGreen-800 text-white py-4 px-8 flex justify-between items-center">
      <div className="text-2xl font-bold">
        <Link to="/">FARMGENIUS GRAPEGROW</Link>
      </div>
      <ul className="flex space-x-6">
        <li>
          <Link
            to="/"
            className="hover:text-farmGray-100 transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard"
            className="hover:text-farmGray-100 transition-colors duration-200"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="hover:text-farmGray-100 transition-colors duration-200"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;