import Navbar from "../components/Navbar";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Sleep() {
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [totalHours, setTotalHours] = useState(null);
  const [quality, setQuality] = useState("");
  const [error, setError] = useState("");
  const [sleepHistory, setSleepHistory] = useState([
  { day: "Mon", hours: 7 },
  { day: "Tue", hours: 6 },
  { day: "Wed", hours: 8 },
  { day: "Thu", hours: 5 },
  { day: "Fri", hours: 7 },
  { day: "Sat", hours: 9 },
  { day: "Sun", hours: 8 },
]);
  const chartData = {
  labels: sleepHistory.map((item) => item.day),
  datasets: [
    {
      label: "Sleep Hours",
      data: sleepHistory.map((item) => item.hours),
      backgroundColor: "rgba(139, 92, 246, 0.7)",
      borderRadius: 6,
    },
  ],
};
  const calculateSleep = () => {
  if (!sleepTime || !wakeTime) {
    setError("Please select both sleep and wake time");
    setTotalHours(null);
    return;
  }

  setError("");

  const start = new Date(`2024-01-01T${sleepTime}`);
  let end = new Date(`2024-01-01T${wakeTime}`);

  if (end <= start) {
    end = new Date(`2024-01-02T${wakeTime}`);
  }

  const diff = (end - start) / (1000 * 60 * 60);
  const hours = Number(diff.toFixed(2));

  setTotalHours(hours);

  if (hours < 6) setQuality("Poor Sleep 😴");
  else if (hours < 8) setQuality("Good Sleep 🙂");
  else setQuality("Excellent Sleep 🌟");

  // Determine current day
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

  // Update sleep history
  const updatedHistory = sleepHistory.map((item) =>
    item.day === today ? { ...item, hours: hours } : item
  );

  setSleepHistory(updatedHistory);
};
  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 pt-24 px-6">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-6">😴 Sleep Tracker</h2>

        <div className="text-left mb-4">
          <label className="block mb-1 font-medium">Sleep Time</label>
          <input
            type="time"
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="text-left mb-4">
          <label className="block mb-1 font-medium">Wake Time</label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={calculateSleep}
          className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition"
        >
          Calculate Sleep
        </button>

        {totalHours && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-lg font-semibold">
              Total Sleep: {totalHours} hours
            </p>
            <p className="mt-2 font-medium text-purple-600">
              {quality}
            </p>
          </div>
        )}

        {/* Weekly Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Weekly Sleep Chart
          </h3>

          <Bar data={chartData} />
        </div>

      </div>
    </div>
  </>
);
}
export default Sleep;