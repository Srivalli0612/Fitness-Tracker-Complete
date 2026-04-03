import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
  });

  const [heightUnit, setHeightUnit] = useState("cm");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.age <= 0)
      newErrors.age = "Enter valid age";

    if (formData.weight <= 0)
      newErrors.weight = "Enter valid weight";

    if (heightUnit === "ft") {
      if (feet <= 0) newErrors.height = "Enter valid height";
    } else {
      if (formData.height <= 0) newErrors.height = "Enter valid height";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const validationErrors = validate();

  if (Object.keys(validationErrors).length === 0) {

    let heightMeters = formData.height;

    if (heightUnit === "cm") {
      heightMeters = formData.height / 100;
    }

    if (heightUnit === "ft") {
      heightMeters = (feet * 12 + Number(inches)) * 0.0254;
    }

    const finalData = {
  name: formData.name,
  email: formData.email,
  password: formData.password,
  age: formData.age,
  height: heightMeters,
  weight: formData.weight
};

    console.log("Sending Data:", finalData);

    axios.post("http://127.0.0.1:8000/api/users/register/", finalData)
      .then((response) => {

  // Save full user profile
  localStorage.setItem("user", JSON.stringify(finalData));

  Swal.fire({
    title: "Registration Successful!",
    text: "Your account has been created.",
    icon: "success",
    confirmButtonText: "Go to Login"
  }).then(() => {
    navigate("/");
  });

})

      .catch((error) => {

  console.log("REAL ERROR:", error.response?.data);

  Swal.fire({
    icon: "error",
    title: "Registration Failed",
    text: error.response?.data?.error || "Something went wrong"
  });

});

    setErrors({});
  } else {
    setErrors(validationErrors);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 mb-1 border rounded-lg"
            onChange={handleChange}
          />
          <p className="text-red-500 text-sm mb-2">{errors.name}</p>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 mb-1 border rounded-lg"
            onChange={handleChange}
          />
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 mb-1 border rounded-lg"
            onChange={handleChange}
          />
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>

          <input
            type="number"
            name="age"
            placeholder="Age"
            className="w-full p-3 mb-1 border rounded-lg"
            onChange={handleChange}
          />
          <p className="text-red-500 text-sm mb-2">{errors.age}</p>

          {/* Height Unit Selector */}
          <select
            value={heightUnit}
            onChange={(e) => setHeightUnit(e.target.value)}
            className="w-full p-3 mb-3 border rounded-lg"
          >
            <option value="cm">Centimeters (cm)</option>
            <option value="m">Meters (m)</option>
            <option value="ft">Feet & Inches</option>
          </select>

          {/* Height Inputs */}

          {heightUnit === "cm" && (
            <input
              type="number"
              name="height"
              step="0.1"
              placeholder="Height in cm"
              className="w-full p-3 mb-1 border rounded-lg"
              onChange={handleChange}
            />
          )}

          {heightUnit === "m" && (
            <input
              type="number"
              name="height"
              step="0.01"
              placeholder="Height in meters"
              className="w-full p-3 mb-1 border rounded-lg"
              onChange={handleChange}
            />
          )}

          {heightUnit === "ft" && (
            <div className="flex gap-3 mb-1">
              <input
                type="number"
                placeholder="Feet"
                value={feet}
                onChange={(e) => setFeet(e.target.value)}
                className="w-1/2 p-3 border rounded-lg"
              />

              <input
                type="number"
                placeholder="Inches"
                value={inches}
                onChange={(e) => setInches(e.target.value)}
                className="w-1/2 p-3 border rounded-lg"
              />
            </div>
          )}

          <p className="text-red-500 text-sm mb-2">{errors.height}</p>

          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            className="w-full p-3 mb-1 border rounded-lg"
            onChange={handleChange}
          />
          <p className="text-red-500 text-sm mb-4">{errors.weight}</p>

          <button className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition">
            Register
          </button>

        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-purple-500 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;