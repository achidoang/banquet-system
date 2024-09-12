import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EventEdit() {
  const { id } = useParams();
  const [eventData, setEventData] = useState({
    ref_no: "",
    booking_by: "",
    pax: 0,
    venue: "",
    status: "",
    note: "",
  });
  const navigate = useNavigate();
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
        setEventData(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/events/${id}`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event updated successfully");
      navigate("/history"); // Redirect to history after update
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event");
    }
  };

  return (
    <div>
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Ref No:
          <input
            type="text"
            value={eventData.ref_no}
            onChange={(e) =>
              setEventData({ ...eventData, ref_no: e.target.value })
            }
            required
          />
        </label>
        <br />
        <label>
          Booking By:
          <input
            type="text"
            value={eventData.booking_by}
            onChange={(e) =>
              setEventData({ ...eventData, booking_by: e.target.value })
            }
            required
          />
        </label>
        <br />
        <label>
          Pax:
          <input
            type="number"
            value={eventData.pax}
            onChange={(e) =>
              setEventData({ ...eventData, pax: parseInt(e.target.value) })
            }
            required
          />
        </label>
        <br />
        <label>
          Venue:
          <input
            type="text"
            value={eventData.venue}
            onChange={(e) =>
              setEventData({ ...eventData, venue: e.target.value })
            }
            required
          />
        </label>
        <br />
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
}

export default EventEdit;
