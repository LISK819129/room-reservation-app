import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Plus, Check, X, Loader } from 'lucide-react';
import './App.css'

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reservations, setReservations] = useState([]);
  const [availableRooms, setAvailableRooms] = useState(['Chennai', 'Erode', 'Dindigul', 'Kovai', 'Salem']);
  const [loading, setLoading] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [kfInitialized, setKfInitialized] = useState(false);

  // Time slots in 24-hour format
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Initialize Kissflow SDK
  useEffect(() => {
    const initializeKissflow = () => {
      if (typeof window !== 'undefined' && window.kf) {
        setKfInitialized(true);
        console.log('Kissflow SDK initialized successfully');
      } else {
        console.log('Waiting for Kissflow SDK to load...');
        setTimeout(initializeKissflow, 100);
      }
    };

    initializeKissflow();
  }, []);

  // Fetch reservations when date changes
  useEffect(() => {
    if (kfInitialized) {
      fetchReservations();
    }
  }, [selectedDate, kfInitialized]);

  const fetchReservations = async () => {
    if (!kfInitialized) {
      console.log('Kissflow SDK not initialized yet');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Fetching reservations for date:', selectedDate);

      const getOptions = {
        method: "GET",
        headers: {
          'X-Access-Key-Id': '-',
          'X-Access-Key-Secret': '-'
        }
      };

      const apiResponse = await window.kf.api('/form/2/AcAQagbvsdz3/Contact_A01/list?page_size=100000', getOptions);
      console.log('Full API Response:', apiResponse);
      
      // Handle the new API response structure
      let reservationData = [];
      if (apiResponse && apiResponse.Data && Array.isArray(apiResponse.Data)) {
        reservationData = apiResponse.Data;
        console.log('Extracted reservation data:', reservationData);
      } else if (apiResponse && Array.isArray(apiResponse)) {
        // Fallback for old format
        reservationData = apiResponse;
      }
      
      if (reservationData.length > 0) {
        // Filter reservations for the selected date
        const dateReservations = reservationData.filter(reservation => {
          if (!reservation.Date_1) return false;
          
          // Parse the date from "2025-06-18T09:00:00+05:30 Asia/Kolkata" format
          const reservationDate = reservation.Date_1.split('T')[0];
          console.log('Comparing dates:', reservationDate, 'vs', selectedDate);
          
          return reservationDate === selectedDate;
        });
        
        console.log('Filtered reservations for date:', selectedDate, dateReservations);
        setReservations(dateReservations);
      } else {
        console.log('No reservation data found');
        setReservations([]);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError(`Failed to fetch reservations: ${error.message}`);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if a room is available at a specific time
  const isRoomAvailable = (room, time) => {
    console.log('=== CHECKING AVAILABILITY ===');
    console.log('Room:', room, 'Time:', time);
    console.log('Current reservations:', reservations);
    
    const isBooked = reservations.some(reservation => {
      // Extract room from reservation
      let roomName = '';
      if (reservation.Room && Array.isArray(reservation.Room) && reservation.Room.length > 0) {
        roomName = reservation.Room[0].trim();
      } else {
        // If Room is empty or not properly set, we'll assume this reservation doesn't block any room
        console.log('Reservation has no room specified:', reservation);
        return false;
      }
      
      // Check if room matches
      const roomMatches = roomName === room;
      console.log(`Room check: "${roomName}" === "${room}" = ${roomMatches}`);
      
      // Extract time from Date_1 (format: "2025-06-18T09:00:00+05:30 Asia/Kolkata")
      let timeMatches = false;
      if (reservation.Date_1) {
        const timeRegex = /T(\d{2}):(\d{2}):(\d{2})/;
        const timeMatch = reservation.Date_1.match(timeRegex);
        
        if (timeMatch) {
          const extractedTime = `${timeMatch[1]}:${timeMatch[2]}`;
          console.log(`Time extracted: ${extractedTime}, comparing with: ${time}`);
          timeMatches = extractedTime === time;
        }
      }
      
      const bothMatch = roomMatches && timeMatches;
      console.log(`Final match for this reservation: ${bothMatch}`);
      
      return bothMatch;
    });
    
    console.log(`Room ${room} at ${time} is ${isBooked ? 'BOOKED' : 'AVAILABLE'}`);
    console.log('=== END AVAILABILITY CHECK ===');
    
    return !isBooked;
  };

  // Get who booked a specific room at a specific time
  const getBookedByUser = (room, time) => {
    const reservation = reservations.find(reservation => {
      // Extract room from reservation
      let roomName = '';
      if (reservation.Room && Array.isArray(reservation.Room) && reservation.Room.length > 0) {
        roomName = reservation.Room[0].trim();
      } else {
        return false;
      }
      
      const roomMatches = roomName === room;
      
      // Extract time
      let timeMatches = false;
      if (reservation.Date_1) {
        const timeRegex = /T(\d{2}):(\d{2}):(\d{2})/;
        const timeMatch = reservation.Date_1.match(timeRegex);
        
        if (timeMatch) {
          const extractedTime = `${timeMatch[1]}:${timeMatch[2]}`;
          timeMatches = extractedTime === time;
        }
      }
      
      return roomMatches && timeMatches;
    });
    
    return reservation ? reservation.First_Name : null;
  };

  // Handle making a reservation
  const handleReservation = async () => {
    if (!kfInitialized) {
      setError('Kissflow SDK not initialized');
      return;
    }

    console.log('Making reservation:', { userName, selectedRoom, selectedTime, selectedDate });
    
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!selectedRoom) {
      setError('Please select a room');
      return;
    }
    
    if (!selectedTime) {
      setError('Please select a time slot');
      return;
    }

    if (!isRoomAvailable(selectedRoom, selectedTime)) {
      setError('This room is no longer available for the selected time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create the datetime string in the same format as the API expects
      const formattedDateTime = `${selectedDate}T${selectedTime}:00+05:30 Asia/Kolkata`;
      
      const reservationData = {
        First_Name: userName,
        Date_1: formattedDateTime,
        Room: [selectedRoom] // Make sure to send as array
      };

      console.log('Sending reservation data:', reservationData);

      const postOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key-Id': 'Akbfcf8186-f2b8-4355-956b-c5e8d973a3a6',
          'X-Access-Key-Secret': '1sIXCGfiB10rNTfxYQBIOh8tRz8C9rUaUEuQcdrDF9CGQgVhysn3Qg1DcwMzVURFoOcmJ9o2nCB70-enrGlNQ'
        },
        body: JSON.stringify(reservationData)
      };

      const result = await window.kf.api('/form/2/AcAQagbvsdz3/Contact_A01/create/submit', postOptions);
      console.log('Reservation created:', result);
      
      setSuccess('Reservation made successfully!');
      setShowReservationForm(false);
      setUserName('');
      setSelectedRoom('');
      setSelectedTime('');
      
      // Refresh reservations after successful creation
      await fetchReservations();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error making reservation:', error);
      setError(`Failed to make reservation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openReservationForm = (room, time) => {
    console.log('Opening form for:', { room, time });
    setSelectedRoom(room);
    setSelectedTime(time);
    setShowReservationForm(true);
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Show loading state if Kissflow SDK is not initialized
  if (!kfInitialized) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Initializing Kissflow SDK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="max-width-container">
        {/* Header */}
        <div className="header-card">
          <div className="header-content">
            <div className="header-title">
              <Calendar className="header-icon" />
              <h1>Meeting Room Calendar</h1>
            </div>
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
            </div>
          </div>
          
          {selectedDate && (
            <div className="date-info">
              <MapPin size={16} />
              <span>Showing availability for {formatDate(selectedDate)}</span>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="status-message status-error">
            <X size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="status-message status-success">
            <Check size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Room Availability Grid */}
        <div className="calendar-card">
          <div className="calendar-header">
            <h2>
              <Users size={20} />
              Room Availability
            </h2>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading availability...</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="availability-table">
                <thead className="table-header">
                  <tr>
                    <th>Time</th>
                    {availableRooms.map(room => (
                      <th key={room}>{room}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(time => (
                    <tr key={time} className="table-row">
                      <td className="table-cell">
                        <div className="time-cell">
                          <Clock className="time-icon" />
                          <span>{time}</span>
                        </div>
                      </td>
                      {availableRooms.map(room => {
                        const available = isRoomAvailable(room, time);
                        const bookedBy = getBookedByUser(room, time);
                        return (
                          <td key={`${room}-${time}`} className="table-cell table-cell-center">
                            {available ? (
                              <button
                                onClick={() => openReservationForm(room, time)}
                                className="available-button"
                              >
                                <Plus className="available-icon" />
                                <span>Available</span>
                              </button>
                            ) : (
                              <div className="booked-container">
                                <span className="booked-button">
                                  Booked
                                </span>
                                {bookedBy && (
                                  <div className="tooltip">
                                    <div className="tooltip-title">Booked by:</div>
                                    <div>{bookedBy}</div>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Current Reservations */}
        {reservations.length > 0 && (
          <div className="reservations-card">
            <div className="reservations-header">
              <h3>Today's Reservations</h3>
            </div>
            <div className="reservations-content">
              <div className="reservations-list">
                {reservations.map((reservation, index) => {
                  const roomName = reservation.Room && reservation.Room.length > 0 
                    ? reservation.Room[0].trim() 
                    : 'No Room Specified';
                  
                  // Extract time from Date_1
                  let displayTime = 'Unknown Time';
                  if (reservation.Date_1) {
                    const timeMatch = reservation.Date_1.match(/T(\d{2}):(\d{2}):(\d{2})/);
                    if (timeMatch) {
                      displayTime = `${timeMatch[1]}:${timeMatch[2]}`;
                    }
                  }
                  
                  return (
                    <div key={reservation._id || index} className="reservation-item">
                      <div className="reservation-left">
                        <div className="reservation-icon">
                          <Users className="icon" />
                        </div>
                        <div className="reservation-details">
                          <h4>{reservation.First_Name || 'Unknown User'}</h4>
                          <p>{roomName}</p>
                        </div>
                      </div>
                      <div className="reservation-time">
                        <p>{displayTime}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Reservation Form Modal */}
        {showReservationForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Make Reservation</h3>
                
                <div>
                  <div className="form-group">
                    <label className="form-label">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="form-input"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Room
                    </label>
                    <input
                      type="text"
                      value={selectedRoom}
                      readOnly
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Date
                    </label>
                    <input
                      type="text"
                      value={formatDate(selectedDate)}
                      readOnly
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Time
                    </label>
                    <input
                      type="text"
                      value={selectedTime}
                      readOnly
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    onClick={handleReservation}
                    disabled={loading || !userName}
                    className="btn btn-primary"
                  >
                    {loading ? 'Reserving...' : 'Reserve Room'}
                  </button>
                  <button
                    onClick={() => setShowReservationForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;