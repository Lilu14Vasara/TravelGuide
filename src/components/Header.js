import React, { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 


const Header = ({ authChange, setAuthChange }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [authChange]); //  Re-render header when authChange changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthChange((prev) => prev + 1); 
    navigate("/login");
  };

  return (
    <header className="bg-green-800 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold" style={{ color: "#F4D03F", textShadow: "2px 2px 4px #154360" }}>
          Padharo Gujarat
        </h1>

        <nav>
          <ul className="flex gap-6">
            <li><Link to="/" className="hover:underline text-lg">Home</Link></li>
            <li><Link to="/places" className="hover:underline text-lg">Places</Link></li>
            <li><Link to="/about" className="hover:underline text-lg">About</Link></li>
            <li><Link to="/contact" className="hover:underline text-lg">Contact</Link></li>
            <li>{token && <Link to="/trip-planner" className="hover:underline text-lg">Trip Planner</Link>}</li>

            {token ? (
              <>
                <li><Link to="/favorites" className="hover:underline text-lg text-yellow-300 font-bold">My Favorites</Link></li>
                <li>
                  <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-md text-white font-bold hover:bg-red-600 transition">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="bg-yellow-400 px-4 py-2 rounded-md text-green-900 font-bold hover:bg-yellow-500 transition">Login</Link></li>
                <li><Link to="/signup" className="bg-yellow-500 px-4 py-2 rounded-md text-green-900 font-bold hover:bg-yellow-600 transition">Signup</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
