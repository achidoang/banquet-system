import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function EventDetail() {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/events/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id, token]);

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h2>Event Details</h2>
      <p>Ref No: {event.ref_no}</p>
      <p>Booking By: {event.booking_by}</p>
      <p>Pax: {event.pax}</p>
      <p>Venue: {event.venue}</p>
      <p>Status: {event.status}</p>
      <p>Note: {event.note}</p>
      {/* Add other event details as needed */}
    </div>
  );
}

export default EventDetail;
