🚀 Overview

LE-EASE is a front-end web application that allows users to browse, book, and manage vehicle rentals. It provides a smooth and user-friendly experience with authentication, booking management, and vehicle exploration.

🎯 Features
🔐 User Authentication (Login / Signup)
🚗 Browse Vehicles (Cars & Bikes)
🔍 Search & Filter Vehicles
📅 Book Vehicles Easily
📊 User Dashboard (View Bookings)
❌ Cancel Bookings
➕ Admin Panel (Add Vehicles)
💾 Data stored using Local Storage (No backend required)
🛠️ Technologies Used
HTML5 – Structure of the website
CSS3 – Styling and layout
JavaScript (Vanilla JS) – Logic and interactivity
LocalStorage API – Data persistence
📂 Project Structure
LE-EASE/
│
├── index.html        # Home Page
├── vehicles.html     # Vehicle Listing Page
├── booking.html      # Booking Page
├── dashboard.html    # User Dashboard
├── admin.html        # Add Vehicle Page
│
├── styles.css        # Styling
├── app.js            # Main JavaScript Logic
│
└── README.md         # Project Documentation
⚙️ How It Works
1. Initialization
When the page loads, initApp() runs.
It sets up:
Authentication UI
Event listeners
Page rendering
2. Authentication System
Users can:
Sign up with name & email
Log in using email
Data is stored in localStorage

Current user is tracked using:

motorent_currentUser
3. Vehicle Management
Vehicles are stored as an array of objects in app.js
Each vehicle contains:
id
name
type (car/bike)
fuel type
price
seats
image
description
4. Booking System
User selects a vehicle → redirected to booking page
Chooses number of days
Total price is calculated dynamically
Booking is saved in localStorage
5. Dashboard
Displays:
Total bookings
Total amount spent
Booking history
Allows booking cancellation
6. Admin Feature
Add new vehicles via form
Data is stored dynamically
💾 Local Storage Keys
Key	Purpose
motorent_users	Stores all users
motorent_currentUser	Logged-in user
motorent_selectedVehicle	Selected vehicle
motorent_bookings	Booking records
🧠 Key Concepts Used
DOM Manipulation
Event Delegation
Template Literals
Array Methods (map, filter, reduce)
JSON Handling (parse, stringify)
Optional Chaining (?.)
Responsive Design
▶️ How to Run
Download or clone the project
Open index.html in any browser
Start exploring the application
⚠️ Limitations
No backend (data stored locally)
Data will be lost if localStorage is cleared
No real payment integration
📌 Future Improvements
Backend integration (Node.js / Firebase)
Payment gateway
Secure authentication (password-based login)
Cloud database
Image upload support
