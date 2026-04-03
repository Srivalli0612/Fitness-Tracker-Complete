import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";

function Workout() {

  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState([]);
  const [myWorkouts, setMyWorkouts] = useState([]);
  const [todayWorkout, setTodayWorkout] = useState();

  const user = JSON.parse(localStorage.getItem("user"));

  // ================= FETCH DATA =================

  useEffect(() => {
  if (user?.email) {
    fetchTemplates();
    fetchMyWorkouts();
    fetchTodayWorkout();
  }
}, [user?.email]);

if (!user) {
  return <h2>Please login first</h2>;
}

  const fetchTemplates = () => {
    axios.get("http://127.0.0.1:8000/api/workouts/templates/")
      .then(res => setTemplates(res.data))
      .catch(err => console.log(err));
  };

 const fetchMyWorkouts = () => {
  axios.get("http://127.0.0.1:8000/api/workouts/my-workouts/", {
    params: { email: user.email }
  })
  .then(res => {
    console.log("My Workouts:", res.data); // ✅ debug
    setMyWorkouts(res.data);
  })
  .catch(err => {
    console.log("ERROR:", err.response?.data);
  });
};

  const fetchTodayWorkout = () => {
  axios.get("http://127.0.0.1:8000/api/workouts/today/", {
    params: { email: user.email }
  })
  .then(res => {
    console.log("Today:", res.data);
    setTodayWorkout(res.data);
  })
  .catch(err => {
    console.log("ERROR:", err.response?.data);
  });
};

const addToToday = (id) => {
  axios.post("http://127.0.0.1:8000/api/workouts/add-to-today/", {
    workout: id,
    email: user.email
  })
  .then(() => {
    Swal.fire("Added!", "Workout added to today's plan", "success");
    fetchTodayWorkout();
  })
  .catch((error) => {
    const msg = error.response?.data?.error;

    if (msg === "Already added for today") {
      Swal.fire("Already Added", "This workout is already in today's plan", "info");
    } else {
      Swal.fire("Error", "Something went wrong", "error");
    }
  });
};

const deleteWorkout = (id) => {
  axios.delete(`http://127.0.0.1:8000/api/workouts/delete/${id}/`, {
    data: { email: user.email }
  })
  .then(() => {
    Swal.fire("Deleted!", "Workout removed", "success");
    fetchMyWorkouts();
  })
  .catch(() => {
    Swal.fire("Error", "Could not delete workout", "error");
  });
};

  // ================= ACTIONS =================

  const assignWorkout = (id) => {
  axios.post("http://127.0.0.1:8000/api/workouts/assign/", {
    workout: id,
    email: user.email
  })
  .then(() => {
    Swal.fire("Added!", "Workout saved successfully", "success");
    fetchMyWorkouts();
  })
  .catch((error) => {
    const msg = error.response?.data?.error;

    if (msg === "Workout already saved") {
      Swal.fire("Already Added", "This workout is already in your list", "info");
    } else {
      Swal.fire("Error", "Something went wrong", "error");
    }
  });
};

  const completeWorkout = (id) => {
  axios.patch(`http://127.0.0.1:8000/api/workouts/complete/${id}/`, {
    email: user.email
  })
  .then(() => {
    Swal.fire("Completed!", "Great job 🎉", "success");
    fetchMyWorkouts();
    fetchTodayWorkout();
  })
  .catch((error) => {
    console.log("ERROR:", error.response?.data);
    Swal.fire("Error", "Something went wrong", "error");
  });
};

  // ================= UI =================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 pt-24 px-6">

        <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl">

          <h2 className="text-2xl font-bold text-center mb-6">
            🏋️ Workout Plan
          </h2>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            <button onClick={() => setActiveTab("templates")} className="btn">Templates</button>
            <button onClick={() => setActiveTab("my")} className="btn">My Workouts</button>
            <button onClick={() => setActiveTab("today")} className="btn">Today</button>
          </div>

          {/* ================= TEMPLATES ================= */}
          {activeTab === "templates" && (
            <div>
              {templates.length === 0 ? (
                <p>No workouts available</p>
              ) : (
                templates.map(w => (
  <div key={w.id} className="border p-4 rounded mb-4">

    <h3 className="text-lg font-semibold text-purple-600">
      {w.title}
    </h3>

    <p><b>Type:</b> {w.workout_type}</p>

    {/* ✅ NEW */}
    <p className="mt-2">
      <b>Description:</b> {w.description || "No description available"}
    </p>

    {/* ✅ NEW */}
    <p className="mt-2">
      <b>Instructions:</b> {w.instructions}
    </p>

    <p><b>Duration:</b> {w.average_duration_minutes} mins</p>
    <p><b>Calories:</b> {w.average_calories_burned}</p>

    <button
      onClick={() => assignWorkout(w.id)}
      className="mt-2 bg-purple-500 text-white px-4 py-2 rounded"
    >
      Assign Workout
    </button>

  </div>
))
              )}
            </div>
          )}

          {/* ================= MY WORKOUTS ================= */}
          {activeTab === "my" && (
  <div>
    {myWorkouts.length === 0 ? (
      <p>No workouts selected</p>
    ) : (
      myWorkouts.map(w => (
        <div key={w.id} className="border p-4 rounded mb-4">

  <h3 className="text-lg font-semibold text-purple-600">
    {w.workout_details.title}
  </h3>

  <p><b>Type:</b> {w.workout_details.workout_type}</p>
  <p><b>Duration:</b> {w.actual_duration} mins</p>

  {/* ✅ ACTION BUTTONS */}
  <div className="flex gap-3 mt-3">

    <button
      onClick={() => addToToday(w.workout)}
      className="bg-green-500 text-white px-3 py-1 rounded"
    >
      Add to Today
    </button>

    <button
      onClick={() => deleteWorkout(w.id)}
      className="bg-red-500 text-white px-3 py-1 rounded"
    >
      Delete
    </button>

  </div>

</div>
      ))
    )}
  </div>
)}
    

          {/* ================= TODAY ================= */}
          {activeTab === "today" && (
  <div>
    {!todayWorkout || todayWorkout.length === 0 ? (
      <p>No workout for today</p>
    ) : (
      todayWorkout.map(w => (
        <div key={w.id} className="border p-4 rounded mb-4">

          <h3 className="text-lg font-semibold text-purple-600">
            {w.workout_details.title}
          </h3>

          <p><b>Type:</b> {w.workout_details.workout_type}</p>
          <p><b>Duration:</b> {w.actual_duration} mins</p>
          <p><b>Calories:</b> {w.actual_calories_burned}</p>

          <p className="mt-2">
            <b>Instructions:</b> {w.workout_details.instructions}
          </p>

          <p className="mt-2">
            Status: {w.status === "completed" ? "✅ Completed" : "⏳ Pending"}
          </p>

          {w.status !== "completed" && (
            <button
              onClick={() => completeWorkout(w.id)}
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
            >
              Mark Complete
            </button>
          )}

        </div>
      ))
    )}
  </div>
)}

        </div>
      </div>
    </>
  );
}

export default Workout;