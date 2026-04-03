import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Water from "./pages/Water";
import BMI from "./pages/BMI";
import Workout from "./pages/Workout";
import Diet from "./pages/Diet";
import Sleep from "./pages/Sleep";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/users/dashboard" element={<Dashboard />} />
        <Route path="/users/water" element={<Water />} />
        <Route path="/users/bmi" element={<BMI />} />
        <Route path="/users/workout" element={<Workout />} />
        <Route path="/users/diet" element={<Diet />} />
        <Route path="/users/sleep" element={<Sleep />} />
        <Route path="/users/progress" element={<Progress />} />
        <Route path="/users/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;