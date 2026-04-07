import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import {
BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell
} from "recharts";

function Dashboard() {

const [loading, setLoading] = useState(true);

const [data, setData] = useState({
calories_consumed: 0,
calories_burned: 0,
net_calories: 0
});

const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
if (user?.email) {
axios.get("http://127.0.0.1:8000/api/users/progress/", {
params: { email: user.email }
})
.then(res => {
setData(res.data);
setLoading(false);
})
.catch(err => {
console.log(err);
setLoading(false);
});
}
}, [user]);

const chartData = [
{ name: "Consumed", value: data.calories_consumed },
{ name: "Burned", value: data.calories_burned },
];

return (
<> <Navbar />

  <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 pt-24 px-6">

    <div className="max-w-6xl mx-auto">

      <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wide">
        📊 Fitness Dashboard
      </h2>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-center">
          <h3 className="text-lg font-semibold text-gray-600">
            🍽️ Calories Consumed
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {data.calories_consumed}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-center">
          <h3 className="text-lg font-semibold text-gray-600">
            🔥 Calories Burned
          </h3>
          <p className="text-3xl font-bold text-red-500">
            {data.calories_burned}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-center">
          <h3 className="text-lg font-semibold text-gray-600">
            ⚖️ Net Calories
          </h3>
          <p className={`text-3xl font-bold ${
            data.net_calories > 0 ? "text-yellow-500" : "text-blue-600"
          }`}>
            {data.net_calories}
          </p>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-white mt-10 p-6 rounded-2xl shadow-lg">

        <h3 className="text-xl font-bold mb-4 text-center">
          📈 Daily Calorie Comparison
        </h3>

        {loading ? (
          <p className="text-center text-gray-500 mt-6">
            ⏳ Loading chart...
          </p>
        ) : (data.calories_consumed > 0 || data.calories_burned > 0) ? (

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 'dataMax + 100']} />
              <Tooltip />

              <Bar 
  dataKey="value" 
  label={{ position: "top" }} 
  radius={[10, 10, 0, 0]}
  isAnimationActive={false}
/>

            </BarChart>
          </ResponsiveContainer>

        ) : (
          <p className="text-center text-gray-500 mt-6">
            No data available for today
          </p>
        )}

      </div>

      {/* SMART INSIGHT */}
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-white">
          {data.net_calories > 0
            ? "⚠️ You are in calorie surplus. Consider more workouts."
            : "✅ Great! You are maintaining a calorie deficit."}
        </p>
      </div>

    </div>
  </div>
</>


);
}

export default Dashboard;
