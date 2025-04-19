import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const verifyTokenBySampleApi = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_HOST}/device/limited?device=temp`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setValid(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Lỗi xác thực token:", err);
        localStorage.removeItem("token");
      }

      setChecking(false);
    };

    verifyTokenBySampleApi();
  }, []);

  if (checking) return <div className="text-center mt-10">Đang xác thực token...</div>;
  if (!valid) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;