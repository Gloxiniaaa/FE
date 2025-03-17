import { Link } from "react-router-dom";

const NavigationBar = () => {
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
          <Link
            to="/login"
            className="hover:text-farmGray-100 transition-colors duration-200"
          >
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;