import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function EventDetail() {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [filteredJobdesks, setFilteredJobdesks] = useState([]); // For jobdesk filtering
  const [selectedDepartment, setSelectedDepartment] = useState("All"); // Default department filter
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
        setFilteredJobdesks(response.data.jobdesks); // Set default jobdesk to all
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id, token]);

  // Handle print
  const handlePrint = () => {
    window.print(); // Print the current page
  };

  // Handle department filter
  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);

    if (department === "All") {
      setFilteredJobdesks(event.jobdesks); // Show all jobdesks
    } else {
      const filtered = event.jobdesks.filter(
        (jobdesk) => jobdesk.department_name === department
      );
      setFilteredJobdesks(filtered);
    }
  };

  if (!event) return <div>Loading...</div>;

  const departments = [
    "All",
    "educator",
    "RA class",
    "shop",
    "herbal",
    "outdoor program",
    "reservasi glamping",
    "guest agent glamping",
    "HK",
    "kitchen",
    "Bar",
    "service/banquet",
    "garden",
    "ticketing",
    "security",
    "atsiri jawa",
    "IT",
    "Engineering",
  ];

  return (
    <div>
      <h2>Event Details</h2>
      <p>
        <strong>Ref No:</strong> {event.ref_no}
      </p>
      <p>
        <strong>Booking By:</strong> {event.booking_by}
      </p>
      <p>
        <strong>Pax:</strong> {event.pax}
      </p>
      <p>
        <strong>Venue:</strong> {event.venue}
      </p>
      <p>
        <strong>Status:</strong> {event.status}
      </p>
      <p>
        <strong>Note:</strong> {event.note}
      </p>

      {/* Rundowns Section */}
      <h3>Rundowns</h3>
      <ul>
        {event.rundowns.map((rundown, index) => (
          <li key={index}>
            {rundown.rundown_date} - {rundown.time_start} to {rundown.time_end}{" "}
            : {rundown.event_activity}
          </li>
        ))}
      </ul>

      {/* Jobdesk Filter */}
      <h3>Jobdesks</h3>
      <label>Filter by Department:</label>
      <select value={selectedDepartment} onChange={handleDepartmentChange}>
        {departments.map((dept, index) => (
          <option key={index} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <ul>
        {filteredJobdesks.map((jobdesk, index) => (
          <li key={index}>
            <strong>{jobdesk.department_name}:</strong> {jobdesk.description} -{" "}
            <strong>Notes:</strong> {jobdesk.notes}, <strong>In Charge:</strong>{" "}
            {jobdesk.people_in_charge}
          </li>
        ))}
      </ul>

      {/* Print Button */}
      <button onClick={handlePrint}>Print</button>
    </div>
  );
}

export default EventDetail;
