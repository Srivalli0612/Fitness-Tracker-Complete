import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {

      axios.post("http://127.0.0.1:8000/api/users/login/", formData)
.then((response) => {

  if (response.data.error) {

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Invalid email or password"
    });

  } else {

    localStorage.setItem("user", JSON.stringify(response.data.user));

    Swal.fire({
      icon: "success",
      title: "Login Successful!",
      text: `Welcome ${response.data.user.name}`,
      confirmButtonText: "Go to Dashboard"
    }).then(() => {
      navigate("/users/dashboard");
    });

  }

})


        .catch((error) => {

          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Email Id or password Incorrect."
          });

          console.error(error);
        });

      setErrors({});

    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-400"
            }`}
            onChange={handleChange}
          />
          <p className="text-red-500 text-sm mb-3">{errors.email}</p>

          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`w-full p-3 mb-1 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-400"
            }`}
            onChange={handleChange}
          />
          <p className="text-red-500 text-sm mb-4">{errors.password}</p>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/users/register" className="text-blue-500 font-semibold">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;