import Navbar from "../components/Navbar";
import { useState } from "react";
import axios from "axios";

function BMI() {

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const [workout, setWorkout] = useState([]);
  const [diet, setDiet] = useState([]);

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

    axios.post("http://127.0.0.1:8000/api/users/bmi-recommendation/", {
      height,
      weight
    })
    .then(res => {
      setBmi(res.data.bmi);
      setCategory(res.data.category);
      setWorkout(res.data.workouts);
      setDiet(res.data.diets);
    })
    .catch(err => {
      console.error(err);
      setError("Something went wrong");
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 pt-24 px-6">
        
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-2xl">

          <h2 className="text-3xl font-bold text-center mb-6">
            📏 BMI Calculator
          </h2>

          {/* INPUTS */}
          <div className="grid gap-4">
            <input
              type="number"
              placeholder="Height (meters)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"
            />

            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"
            />

            <button
              onClick={calculateBMI}
              className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition"
            >
              Calculate BMI
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}

          {/* RESULT */}
          {bmi && (
            <div className="mt-6 p-6 bg-gray-100 rounded-2xl text-center shadow">

              <p className="text-xl font-semibold">
                Your BMI: <span className="text-purple-700">{bmi}</span>
              </p>

              <p className="mt-2">
                Category:
                <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm
                  ${category === "Underweight" && "bg-blue-500"}
                  ${category === "Normal" && "bg-green-500"}
                  ${category === "Overweight" && "bg-yellow-500"}
                  ${category === "Obese" && "bg-red-500"}
                `}>
                  {category}
                </span>
              </p>

              <p className="mt-3 text-gray-600">
                💡 Personalized recommendations based on your BMI
              </p>
            </div>
          )}

          {/* WORKOUTS */}
          {workout.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3">
                🏋️ Recommended Workouts
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {workout.map((w, index) => (
                  <div 
                    key={index} 
                    className="bg-blue-100 p-4 rounded-xl shadow hover:scale-105 transition"
                  >
                    <h4 className="font-semibold text-blue-700">
                      {w.title}
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {w.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DIET */}
          {diet.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3">
                🥗 Recommended Diet
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {diet.map((d, index) => (
                  <div 
                    key={index} 
                    className="bg-green-100 p-4 rounded-xl shadow hover:scale-105 transition"
                  >
                    <h4 className="font-semibold text-green-700">
                      {d.title}
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      {d.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default BMI;