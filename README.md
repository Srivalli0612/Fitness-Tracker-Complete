# 🏋️ Fitness Tracker (Full Stack)

A full-stack web application that helps users manage their fitness journey by tracking workouts, diet, BMI, and overall progress.

---

## 🚀 Features

* 🔐 User Authentication (Register & Login)
* 👤 User Profile Management (Age, Height, Weight)
* 📏 BMI Calculator with smart recommendations
* 🥗 Diet Plan Tracking (daily calories)
* 🏋️ Workout Plan Tracking (calories burned)
* 🔥 Daily Calorie Balance (consumed vs burned)
* 📈 Progress Dashboard

---

## 🛠️ Tech Stack

### Frontend:

* React.js
* Axios
* Tailwind CSS

### Backend:

* Django
* Django REST Framework

### Database:

* MySQL

---

## 📂 Project Structure

fitness-tracker/
├── fitness_backend/   # Django Backend
├── fitness-frontend/  # React Frontend
├── README.md
├── .gitignore

---

## ⚙️ Installation & Setup

### 🔹 Clone the repository

git clone https://github.com/YOUR_USERNAME/Fitness-Tracker-Complete.git
cd Fitness-Tracker-Complete

---

### 🔹 Backend Setup (Django)

cd fitness_backend

pip install -r requirements.txt

# Apply migrations

python manage.py makemigrations
python manage.py migrate

# Run server

python manage.py runserver

---

### 🔹 Frontend Setup (React)

cd fitness-frontend

npm install

npm run dev

---

## 🌐 API Endpoints (Sample)

* `/api/users/register/` → Register user
* `/api/users/login/` → Login
* `/api/users/profile/` → Get profile
* `/api/diet/templates/` → Diet plans
* `/api/workouts/templates/` → Workout plans
* `/api/users/progress/` → Calories tracking
* `/api/users/bmi-recommendation/` → BMI + recommendations

---

## 📸 Screenshots

(Add screenshots here later)

---

## 🌟 Key Highlights

* Full-stack integration (React + Django)
* Real-time calorie tracking system
* Personalized recommendations using BMI
* Clean UI with Tailwind CSS
* REST API based architecture

---

## 🚀 Future Enhancements

* 🔹 AI-based workout & diet suggestions
* 🔹 Mobile responsive UI improvements
* 🔹 Notifications & reminders
* 🔹 Deployment with Docker

---

## 📌 Note

This project was developed as part of learning full-stack development and applying real-world problem-solving using modern web technologies.

---
