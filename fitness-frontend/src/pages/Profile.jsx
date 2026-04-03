import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

function Profile() {

  const [profile, setProfile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.email) {
  console.log("User not found in localStorage");
  return;
}

  useEffect(() => {
  if (!user || !user.email) {
    console.log("No user found");
    return;
  }

  console.log("Fetching profile for:", user.email);

  axios.get("http://127.0.0.1:8000/api/users/profile/", {
    params: { email: user.email }
  })
  .then(res => {
    console.log("PROFILE:", res.data);
    setProfile(res.data);
  })
  .catch(err => {
    console.log("ERROR:", err.response?.data);
  });

}, []);
  if (!user) {
    return <h2>No user logged in</h2>;
  }

  if (!profile) {
    return <h2>Loading profile...</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 pt-24 px-6">

        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-2xl font-bold mb-6 text-center">
            User Profile
          </h2>

          <p><b>Name:</b> {profile.name}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Age:</b> {profile.age}</p>
          <p><b>Height:</b> {profile.height} m</p>
          <p><b>Weight:</b> {profile.weight} kg</p>

        </div>

      </div>
    </>
  );
}

export default Profile;