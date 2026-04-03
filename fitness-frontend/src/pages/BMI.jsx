import Navbar from "../components/Navbar";
import { useState } from "react";
import axios from "axios";

function BMI() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [workout, setWorkout] = useState("");
const [diet, setDiet] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) {
      setError("Please enter both height and weight");
      setBmi(null);
      return;
    }

    if (height <= 0 || weight <= 0) {
      setError("Height and weight must be positive numbers");
      setBmi(null);
      return;
    }

    setError("");

    const bmiValue = (weight / (height * height)).toFixed(2);
    setBmi(bmiValue);

    if (bmiValue < 18.5) setCategory("Underweight");
    else if (bmiValue < 24.9) setCategory("Normal Weight");
    else if (bmiValue < 29.9) setCategory("Overweight");
    else setCategory("Obese");
  };
  axios.post("http://127.0.0.1:8000/api/users/bmi-recommendation/", {
  height,
  weight
})
.then(res => {
  setBmi(res.data.bmi);
  setCategory(res.data.category);
  setWorkout(res.data.workout_recommendation);
  setDiet(res.data.diet_recommendation);
});

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 pt-24 px-6">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            📏 BMI Calculator
          </h2>

          <input
            type="number"
            placeholder="Height (meters)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <button
            onClick={calculateBMI}
            className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
          >
            Calculate BMI
          </button>

          {bmi && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-lg font-semibold">
                Your BMI: {bmi}
              </p>
              <p className="text-md text-gray-700">
                Category: <span className="font-bold">{category}</span>
              </p>
            </div>
          )}
          <h3>Category: {category}</h3>

<div className="mt-4">
  <p><b>🏋️ Workout Recommendation:</b> {workout}</p>
  <p><b>🥗 Diet Recommendation:</b> {diet}</p>
</div>

        </div>
      </div>
    </>
  );
}

export default BMI;