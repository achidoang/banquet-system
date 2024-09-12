import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Function to decode JWT token from localStorage
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch (error) {
    return null;
  }
};

function History() {
  const [events, setEvents] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({
    id: "",
    status: "",
    note: "",
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = parseJwt(token); // Decode the token to get the current user

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [token]);

  // Delete event by id
  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event._id !== id));
      alert("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  };

  // Handle Status Update form submission
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/events/${statusUpdate.id}/status`,
        { status: statusUpdate.status, note: statusUpdate.note },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Status updated successfully");
      setShowUpdateForm(false); // Hide form after successful update
      const response = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data); // Update event list with new status
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <h2>Event History</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Ref No</th>
            <th>Booking By</th>
            <th>Pax</th>
            <th>Venue</th>
            <th>Status</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.ref_no}</td>
              <td>{event.booking_by}</td>
              <td>{event.pax}</td>
              <td>{event.venue}</td>
              <td>{event.status}</td>
              <td>{event.note}</td>
              <td>
                {/* Detail Event */}
                <button onClick={() => navigate(`/events/${event._id}`)}>
                  Detail
                </button>

                {/* IT and Admin can edit and delete */}
                {["it", "admin"].includes(currentUser?.role) && (
                  <>
                    {/* Edit Event */}
                    <button
                      onClick={() => navigate(`/events/edit/${event._id}`)}
                    >
                      Edit
                    </button>

                    {/* Delete Event */}
                    <button onClick={() => deleteEvent(event._id)}>
                      Delete
                    </button>

                    {/* Update Status */}
                    <button
                      onClick={() => {
                        setStatusUpdate({
                          id: event._id,
                          status: "",
                          note: "",
                        });
                        setShowUpdateForm(true);
                      }}
                    >
                      Update Status
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Status Update Form */}
      {showUpdateForm && (
        <div>
          <h3>Update Status for Event</h3>
          <form onSubmit={handleStatusUpdate}>
            <label>
              Status:
              <select
                value={statusUpdate.status}
                onChange={(e) =>
                  setStatusUpdate({ ...statusUpdate, status: e.target.value })
                }
                required
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="process">Process</option>
                <option value="done">Done</option>
                <option value="cancel">Cancel</option>
              </select>
            </label>
            <br />
            <label>
              Note:
              <input
                type="text"
                value={statusUpdate.note}
                onChange={(e) =>
                  setStatusUpdate({ ...statusUpdate, note: e.target.value })
                }
                required
              />
            </label>
            <br />
            <button type="submit">Update</button>
            <button type="button" onClick={() => setShowUpdateForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default History;
