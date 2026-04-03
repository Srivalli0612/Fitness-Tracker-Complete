import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {

    localStorage.removeItem("user");

    console.log("Logged out");

    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-xl font-bold text-purple-600">
          Fitness Tracker
        </h1>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 text-gray-700 font-medium">

          <Link to="/users/dashboard" className="hover:text-purple-600">
            Dashboard
          </Link>

          <Link to="/users/water" className="hover:text-purple-600">
            Water
          </Link>

          <Link to="/users/bmi" className="hover:text-purple-600">
            BMI
          </Link>

          <Link to="/users/workout" className="hover:text-purple-600">
            Workout
          </Link>

          <Link to="/users/diet" className="hover:text-purple-600">
            Diet
          </Link>

          <Link to="/users/sleep" className="hover:text-purple-600">
            Sleep
          </Link>

          <Link to="/users/progress" className="hover:text-purple-600">
            Progress
          </Link>

          <Link to="/users/profile" className="hover:text-purple-600">
            Profile
          </Link>

          {/* User Name */}
          {user && (
            <span className="text-purple-600 font-semibold">
              {user.name}
            </span>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            Logout
          </button>

        </div>
      </div>

    </nav>
  );
}

export default Navbar;