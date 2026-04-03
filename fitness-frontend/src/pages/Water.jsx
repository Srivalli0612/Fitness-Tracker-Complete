import Navbar from "../components/Navbar";
import { useState } from "react";

function Water() {
  const [intervalHours, setIntervalHours] = useState("");

  const setReminder = () => {
    alert(`Reminder set every ${intervalHours} hours`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 pt-24 px-6">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-6">💧 Water Reminder</h2>

          <input
            type="number"
            placeholder="Enter interval (hours)"
            className="w-full p-3 mb-4 border rounded-lg"
            onChange={(e) => setIntervalHours(e.target.value)}
          />

          <button
            onClick={setReminder}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition"
          >
            Set Reminder
          </button>
        </div>
      </div>
    </>
  );
}

export default Water;