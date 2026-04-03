import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

function Progress() {

  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/users/progress/", {
      params: { email: user.email }
    })
    .then(res => setData(res.data))
    .catch(err => console.log(err));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 pt-24 flex justify-center">

        <div className="bg-white p-6 rounded-xl shadow-lg w-96">

          <h2 className="text-xl font-bold text-center mb-4">
            📊 Today's Progress
          </h2>

          <p><b>Calories Consumed:</b> {data.calories_consumed}</p>
          <p><b>Calories Burned:</b> {data.calories_burned}</p>
          <p><b>Net Calories:</b> {data.net_calories}</p>

        </div>

      </div>
    </>
  );
}

export default Progress;