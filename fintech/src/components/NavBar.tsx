import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    // You can use either of the following lines:
    // 1. To navigate and refresh:
    window.location.href = "/login";

    // 2. To navigate without full reload:
    // navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="absolute top-0 right-0 left-0 bg-transparent p-4 px-4 md:px-16">
      <div className="flex justify-end items-center space-x-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-all"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-all"
          >
            <FaSignInAlt className="mr-2" />
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
