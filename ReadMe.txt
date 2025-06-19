1. Project Overview
A React-based web application that allows users to check real-time availability of meeting rooms, reserve time slots, and receive confirmation emails. It is integrated with Kissflow API to store and fetch reservation data dynamically.

2. Features
📅 View daily room availability with time slots

🖱 Real-time booking interface

⚡ Live updates on booking status

📬 Email confirmation upon successful booking

🔁 Auto-refresh and seamless UI update after reservation

🔐 Kissflow API integration for secure data storage

3. Tech Stack
Tech	Purpose
React	Frontend UI
Lucide-react	Icons
Kissflow SDK	Backend form integration
HTML/CSS	Styling and structure

4. Workflow Diagram
(Insert flowchart here if presenting with visuals)

5. How It Works
User opens the app (defaults to today’s date)

User sees room and time slot availability

User selects a room + time, enters their name, clicks "Reserve"

System checks availability

Data is sent to Kissflow via POST

Reservation is stored in Kissflow Dataform

System fetches updated data via GET

UI is refreshed, and time slot is marked Booked

Email confirmation is sent to the user

Page updates — ✅ Done!

6. API Usage (Kissflow)
➕ POST - Create Reservation
Endpoint:
/form/2/AcAQagbvsdz3/Contact_A01/create/submit

Headers:

pgsql
Copy
Edit
X-Access-Key-Id: <your-key>
X-Access-Key-Secret: <your-secret>
Content-Type: application/json
Payload Example:

json
Copy
Edit
{
  "First_Name": "Atul",
  "Date_1": "2025-06-20T14:00:00+05:30 Asia/Kolkata",
  "Room": ["Chennai"]
}
📥 GET - Fetch Reservations
Endpoint:
/form/2/AcAQagbvsdz3/Contact_A01/list?page_size=100000

Headers: Same as POST

7. Email Integration
Triggered via Kissflow Workflow

Sends a confirmation email using a pre-defined template

Includes name, date, time, and room info

8. Folder Structure
pgsql
Copy
Edit
MeetingRoomApp/
├── App.js
├── App.css
├── index.js
├── components/
├── assets/
├── public/
└── README.md
9. Security Notes
❌ Do NOT expose API keys in frontend for production

✅ For production, use backend proxy or environment variables

10. Future Enhancements
🔐 User login & authentication

🛠 Admin panel for cancel/edit

⏰ Email/Slack reminders

📊 Export reservations to Excel/CSV

11. Testing & Validation
✅ Manual UI testing

⚙ Use test keys when running locally

🧪 Check edge cases:

Double booking

Booking past time

Network/API errors

** Note - Removed the API access keys 

