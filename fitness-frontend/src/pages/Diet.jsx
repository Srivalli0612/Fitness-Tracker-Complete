import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";

function Diet() {

  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState([]);
  const [myDiet, setMyDiet] = useState([]);
  const [todayDiet, setTodayDiet] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Safety check
  if (!user) {
    return <h2 className="text-center mt-10">Please login first</h2>;
  }

  // ================= FETCH DATA =================

  useEffect(() => {
  fetchTemplates(); // always load templates

  if (user?.email) {
    fetchMyDiet();
    fetchTodayDiet();
    fetchCalories();
  }
}, [user?.email]);

  const fetchTemplates = () => {
  axios.get("http://127.0.0.1:8000/api/diet/templates/")
    .then(res => {
      console.log("TEMPLATES DATA:", res.data); // 👈 ADD THIS
      setTemplates(res.data);
    })
    .catch(err => console.log("ERROR:", err.response?.data));
};

  const fetchMyDiet = () => {
    axios.get("http://127.0.0.1:8000/api/diet/my-diet/", {
      params: { email: user.email }
    })
    .then(res => setMyDiet(res.data))
    .catch(err => console.log("ERROR:", err.response?.data));
  };

  const fetchTodayDiet = () => {
    axios.get("http://127.0.0.1:8000/api/diet/today/", {
      params: { email: user.email }
    })
    .then(res => setTodayDiet(res.data))
    .catch(err => console.log("ERROR:", err.response?.data));
  };

  // ================= ACTIONS =================

  const assignDiet = (id) => {
    axios.post("http://127.0.0.1:8000/api/diet/assign/", {
      diet: id,
      email: user.email
    })
    .then(() => {
      Swal.fire("Saved!", "Diet added to your list", "success");
      fetchMyDiet();
    })
    .catch((error) => {
      const msg = error.response?.data?.error;

      if (msg === "Diet already saved") {
        Swal.fire("Already Added", "This diet is already in your list", "info");
      } else {
        Swal.fire("Error", "Something went wrong", "error");
      }
    });
  };

  const addToToday = (id) => {
    axios.post("http://127.0.0.1:8000/api/diet/add-to-today/", {
      diet: id,
      email: user.email
    })
    .then(() => {
      Swal.fire("Added!", "Added to today's diet", "success");
      fetchTodayDiet();
    })
    .catch((error) => {
      const msg = error.response?.data?.error;

      if (msg === "Already added") {
        Swal.fire("Already Added", "Already in today's plan", "info");
      } else {
        Swal.fire("Error", "Something went wrong", "error");
      }
    });
  };

  const deleteDiet = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/diet/delete/${id}/`, {
      data: { email: user.email }
    })
    .then(() => {
      Swal.fire("Deleted!", "Removed from your list", "success");
      fetchMyDiet();
    })
    .catch(() => {
      Swal.fire("Error", "Could not delete", "error");
    });
  };

  const completeDiet = (id) => {
  axios.patch(`http://127.0.0.1:8000/api/diet/complete/${id}/`, {
    email: user.email
  })
  .then(() => {
    Swal.fire("Completed!", "Meal logged 🎉", "success");
    fetchTodayDiet();
    fetchCalories(); // already good ✅
  })
  .catch(() => {
    Swal.fire("Error", "Something went wrong", "error");
  });
};

  const fetchCalories = () => {
  axios.get("http://127.0.0.1:8000/api/diet/calories-today/", {
    params: { email: user.email }
  })
  .then(res => setTotalCalories(res.data.total_calories || 0))
  .catch(err => console.log(err));
};

  // ================= UI =================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 pt-24 px-6">

        <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl">

          <h2 className="text-2xl font-bold text-center mb-6">
            🍎 Diet Plan
          </h2>

        <div className="text-center mb-6">

        {/*<h3 className="text-xl font-semibold text-gray-700">
          🔥 Calories Consumed Today
        </h3>

        <p className="text-3xl font-bold text-green-600">
          {totalCalories} kcal
        </p>*/}

</div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            <button onClick={() => setActiveTab("templates")} className="btn">Templates</button>
            <button onClick={() => setActiveTab("my")} className="btn">My Diet</button>
            <button onClick={() => setActiveTab("today")} className="btn">Today</button>
          </div>

          {/* ================= TEMPLATES ================= */}
          {activeTab === "templates" && (
            <div>
              {templates.length === 0 ? (
                <p>No diet plans available</p>
              ) : (
                templates.map(d => (
                  <div key={d.id} className="border p-4 rounded mb-4">

                    <h3 className="text-lg font-semibold text-green-600">
                      {d.title}
                    </h3>

                    <p><b>Meal:</b> {d.meal_type}</p>
                    <p><b>Description:</b> {d.description}</p>

                    <p><b>Calories:</b> {d.calories}</p>
                    <p><b>Protein:</b> {d.protein}g</p>
                    <p><b>Carbs:</b> {d.carbs}g</p>
                    <p><b>Fats:</b> {d.fats}g</p>

                    <button
                      onClick={() => assignDiet(d.id)}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Save Diet
                    </button>

                  </div>
                ))
              )}
            </div>
          )}

          {/* ================= MY DIET ================= */}
          {activeTab === "my" && (
            <div>
              {myDiet.length === 0 ? (
                <p>No diets saved</p>
              ) : (
                myDiet.map(d => {

                  const isToday = todayDiet.some(t => t.diet === d.diet);

                  return (
                    <div key={d.id} className="border p-4 rounded mb-4">

                      <h3 className="text-lg font-semibold text-green-600">
                        {d.diet_details.title}
                      </h3>

                      <p><b>Meal:</b> {d.diet_details.meal_type}</p>
                      <p><b>Calories:</b> {d.diet_details.calories}</p>

                      <div className="flex gap-3 mt-3">

                        <button
                          disabled={isToday}
                          onClick={() => addToToday(d.diet)}
                          className={`px-3 py-1 rounded ${
                            isToday ? "bg-gray-400" : "bg-blue-500 text-white"
                          }`}
                        >
                          {isToday ? "Added" : "Add to Today"}
                        </button>

                        <button
                          onClick={() => deleteDiet(d.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ================= TODAY ================= */}
          {activeTab === "today" && (
            <div>
              {todayDiet.length === 0 ? (
                <p>No meals for today</p>
              ) : (
                todayDiet.map(d => (
                  <div key={d.id} className="border p-4 rounded mb-4">

                    <h3 className="text-lg font-semibold text-green-600">
                      {d.diet_details.title}
                    </h3>

                    <p><b>Meal:</b> {d.diet_details.meal_type}</p>
                    <p><b>Calories:</b> {d.diet_details.calories}</p>

                    <p className="mt-2">
                      Status: {d.status === "completed" ? "✅ Completed" : "⏳ Pending"}
                    </p>

                    {d.status !== "completed" && (
                      <button
                        onClick={() => completeDiet(d.id)}
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Mark Consumed
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

export default Diet;