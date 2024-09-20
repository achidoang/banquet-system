import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { formatDate } from "./utils";
import "../css/History.css";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  InputLabel,
  FormControl,
  Typography,
  Grow,
} from "@mui/material";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [statusUpdate, setStatusUpdate] = useState({
    id: "",
    status: "",
    note: "",
  });
  const [eventsPerPage] = useState(4); // Number of events per page
  const [sortKey, setSortKey] = useState("start_date"); // Default sorting by start_date
  const [sortOrder, setSortOrder] = useState("desc"); // Default order descending (newest first)
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = parseJwt(token);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedData = response.data.sort(
          (a, b) => new Date(b.start_date) - new Date(a.start_date)
        ); // Sort events by newest start_date
        setEvents(sortedData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [token]);

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
      setShowUpdateForm(false);
      const response = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
    const sortedEvents = [...events].sort((a, b) => {
      if (key === "start_date" || key === "end_date") {
        return order === "asc"
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      if (order === "asc") {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    setEvents(sortedEvents);
  };

  const filteredEvents = events.filter((event) =>
    filterStatus === "All" ? true : event.status === filterStatus
  );

  const searchedEvents = filteredEvents.filter(
    (event) =>
      event.ref_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.booking_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = searchedEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="history-container">
      <h2>Event History</h2>

      <input
        type="text"
        placeholder="Search by Ref No, Booking By, Venue"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="filter-dropdown"
      >
        <option value="All">All</option>
        <option value="pending">Pending</option>
        <option value="process">Process</option>
        <option value="done">Done</option>
        <option value="cancel">Cancel</option>
      </select>

      <table className="event-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("ref_no")} className="col-1">
              Ref No
            </th>
            <th onClick={() => handleSort("booking_by")} className="col-1">
              Booking By
            </th>
            <th onClick={() => handleSort("start_date")} className="col-2">
              Start Date
            </th>
            <th onClick={() => handleSort("end_date")} className="col-2">
              End Date
            </th>
            <th onClick={() => handleSort("pax")} className="col-1">
              Pax
            </th>
            <th onClick={() => handleSort("status")} className="col-1">
              Status
            </th>
            <th className="col-2">Note</th>
            <th className="col-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map((event) => (
            <tr key={event._id}>
              <td>{event.ref_no}</td>
              <td>{event.booking_by}</td>
              <td>{formatDate(event.start_date)}</td>
              <td>{formatDate(event.end_date)}</td>
              <td>{event.pax}</td>
              <td>
                <span className={`status ${event.status}`}>{event.status}</span>
              </td>
              <td>{event.note}</td>
              <td>
                <button onClick={() => navigate(`/events/${event._id}`)}>
                  Detail
                </button>
                {["it", "admin"].includes(currentUser?.role) && (
                  <>
                    <button
                      onClick={() => navigate(`/events/edit/${event._id}`)}
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteEvent(event._id)}>
                      Delete
                    </button>
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

      {showUpdateForm && (
        <Grow in={showUpdateForm}>
          <Box className="update-status-form" mt={3} p={3} boxShadow={3}>
            <Typography variant="h6" gutterBottom>
              Update Status for Event
            </Typography>
            <form onSubmit={handleStatusUpdate}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusUpdate.status}
                  onChange={(e) =>
                    setStatusUpdate({ ...statusUpdate, status: e.target.value })
                  }
                  required
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="process">Process</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                  <MenuItem value="cancel">Cancel</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Note"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={statusUpdate.note}
                onChange={(e) =>
                  setStatusUpdate({ ...statusUpdate, note: e.target.value })
                }
              />
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginRight: "10px" }}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </Grow>
      )}

      <Pagination
        count={Math.ceil(searchedEvents.length / eventsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        className="pagination"
      />
    </div>
  );
}

export default History;
