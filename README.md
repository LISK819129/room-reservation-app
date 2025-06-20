# Kissflow Room Reservation App

<div align="center">
  <h3>A modern React-based meeting room booking system with real-time availability</h3>
</div>

---

## 📋 Project Overview

A sleek, responsive React web application that streamlines meeting room reservations with real-time availability checking. Users can effortlessly book time slots, receive instant confirmations, and enjoy seamless integration with Kissflow's powerful API for secure data management.

---

## ✨ Features

🗓️ **Daily Room Availability** - View real-time availability with intuitive time slot displays

🖱️ **Interactive Booking Interface** - One-click reservation system with instant feedback

⚡ **Live Status Updates** - Real-time booking status with automatic UI refresh

📧 **Email Confirmations** - Automated confirmation emails upon successful bookings

🔄 **Auto-Refresh System** - Seamless UI updates without manual page reloads

🔐 **Secure API Integration** - Kissflow SDK integration for reliable data storage

🎨 **Modern UI/UX** - Clean, responsive design optimized for all devices

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React** | Frontend Framework |
| **Lucide React** | Icon Library |
| **Kissflow SDK** | Backend Integration |
| **HTML5/CSS3** | Structure & Styling |
| **JavaScript ES6+** | Core Logic |

---

## How It Works

1. **App Launch** - Application loads with today's date as default
2. **View Availability** - Real-time display of room and time slot availability
3. **Make Reservation** - User selects room, time slot, and enters their details
4. **System Validation** - Automatic availability check before processing
5. **Data Submission** - Secure POST request to Kissflow API
6. **Data Storage** - Reservation stored in Kissflow Dataform
7. **Live Update** - GET request fetches updated availability data
8. **Confirmation** - UI refreshes, slot marked as "Booked", email sent

---

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn package manager
- Kissflow workspace access

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

   *[Screenshot placeholder: Local development server running]*

3. **Make Your Changes**
   - Edit components in `/src` directory
   - Hot reload enabled for instant preview
   - Test functionality locally before deployment

### Kissflow Deployment

1. **Build for Production**
   ```bash
   node zip.js
   ```
   This creates an optimized build in the parent directory



2. **Create Deployment Package**
   - A `.zip` file will be generated automatically
   - Contains all necessary files for Kissflow deployment

   

3. **Upload to Kissflow**
   - Navigate to your Kissflow workspace
   - Go to **Custom Components** section
   - Upload the generated `.zip` file
   - Click **Preview** to test functionality
   - **Save** to deploy to production

---

## Screenshots  

### Main Interface
![Main Interface](https://i.postimg.cc/J4ZZYH4N/Screenshot-2025-06-20-at-12-32-18-PM.png)

### Booking Process
![Main Interface](https://i.postimg.cc/yx9gG2B1/Screenshot-2025-06-20-at-12-33-27-PM.png)

### Email Confirmation
![Main Interface](https://i.postimg.cc/JnHGySsN/Screenshot-2025-06-20-at-4-19-20-PM.png)