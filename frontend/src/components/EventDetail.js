import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material"; // Material-UI components
import { formatDate, formatTime } from "./utils"; // Util functions

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [filteredJobdesks, setFilteredJobdesks] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
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
        setFilteredJobdesks(response.data.jobdesks);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id, token]);

  const handlePrint = () => {
    window.print();
  };

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);

    if (department === "All") {
      setFilteredJobdesks(event.jobdesks);
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
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h2>Event Details</h2>
          <p>
            <strong>Ref No:</strong> {event.ref_no}
          </p>
          <p>
            <strong>Deposit Received:</strong> {event.deposit_received}
          </p>
          <p>
            <strong>Booking By:</strong> {event.booking_by}
          </p>
          <p>
            <strong>Billing Address:</strong> {event.billing_address}
          </p>
          <p>
            <strong>Start Date:</strong> {formatDate(event.start_date)}
          </p>
          <p>
            <strong>End Date:</strong> {formatDate(event.end_date)}
          </p>
          <p>
            <strong>Pax:</strong> {event.pax}
          </p>
          <p>
            <strong>Venue:</strong> {event.venue}
          </p>
          <p>
            <strong>Sales in Charge:</strong> {event.sales_in_charge}
          </p>
          <p>
            <strong>Contact Person:</strong> {event.contact_person}
          </p>
          <p>
            <strong>List Event:</strong> {event.list_event}
          </p>
          <p>
            <strong>Status:</strong> {event.status}
          </p>
          <p>
            <strong>Note:</strong> {event.note}
          </p>

          <h3>Rundowns</h3>
          <ul>
            {event.rundowns.map((rundown, index) => (
              <li key={index}>
                {formatDate(rundown.rundown_date)} -{" "}
                {formatTime(rundown.time_start)} to{" "}
                {formatTime(rundown.time_end)}: {rundown.event_activity}
              </li>
            ))}
          </ul>

          {/* Jobdesk Filter */}
          <h3>Jobdesks</h3>
          <div className="no-print">
            <FormControl fullWidth variant="outlined" className="mb-3">
              <InputLabel>Filter by Department</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                label="Filter by Department"
              >
                {departments.map((dept, index) => (
                  <MenuItem key={index} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <ul>
            {filteredJobdesks.map((jobdesk, index) => (
              <li key={index}>
                <strong>{jobdesk.department_name}:</strong>{" "}
                {jobdesk.description} - <strong>Notes:</strong> {jobdesk.notes},{" "}
                <strong>In Charge:</strong> {jobdesk.people_in_charge}
              </li>
            ))}
          </ul>

          {/* Print Button */}
          <div className="no-print mt-3">
            <Button variant="contained" color="primary" onClick={handlePrint}>
              Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
