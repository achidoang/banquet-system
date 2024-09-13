import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EventForm() {
  const [refNo, setRefNo] = useState("");
  const [depositReceived, setDepositReceived] = useState("");
  const [bookingBy, setBookingBy] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pax, setPax] = useState(0);
  const [venue, setVenue] = useState("");
  const [salesInCharge, setSalesInCharge] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [listEvent, setListEvent] = useState("");
  const [note, setNote] = useState("");
  const [rundowns, setRundowns] = useState([
    { rundown_date: "", time_start: "", time_end: "", event_activity: "" },
  ]);
  const [jobdesks, setJobdesks] = useState([
    { department_name: "", description: "", notes: "", people_in_charge: "" },
  ]);

  const [previewMode, setPreviewMode] = useState(false); // For preview mode
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const departments = [
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
    "it",
    "engineering",
  ];

  // Function to add new rundown
  const addRundown = () => {
    setRundowns([
      ...rundowns,
      { rundown_date: "", time_start: "", time_end: "", event_activity: "" },
    ]);
  };

  // Function to remove rundown
  const removeRundown = (index) => {
    const updatedRundowns = rundowns.filter((_, i) => i !== index);
    setRundowns(updatedRundowns);
  };

  // Function to add new jobdesk
  const addJobdesk = () => {
    setJobdesks([
      ...jobdesks,
      { department_name: "", description: "", notes: "", people_in_charge: "" },
    ]);
  };

  // Function to remove jobdesk
  const removeJobdesk = (index) => {
    const updatedJobdesks = jobdesks.filter((_, i) => i !== index);
    setJobdesks(updatedJobdesks);
  };

  // Function to handle form submission
  const handlePreview = (e) => {
    e.preventDefault();
    setPreviewMode(true); // Activate preview mode
  };

  const handleSaveToDatabase = async () => {
    const eventData = {
      ref_no: refNo,
      deposit_received: depositReceived,
      booking_by: bookingBy,
      billing_address: billingAddress,
      start_date: startDate,
      end_date: endDate,
      pax: pax,
      venue: venue,
      sales_in_charge: salesInCharge,
      contact_person: contactPerson,
      list_event: listEvent,
      status: "pending", // Default status
      note: note,
      rundowns: rundowns,
      jobdesks: jobdesks,
    };

    try {
      await axios.post("http://localhost:5000/api/events", eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event created successfully");
      navigate("/history"); // Redirect to history after successful creation
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event");
    }
  };

  const handleEdit = () => {
    setPreviewMode(false); // Go back to edit mode
  };

  return (
    <div>
      <h2>Create Event</h2>
      {!previewMode ? (
        <form onSubmit={handlePreview}>
          <div>
            <label>Ref No</label>
            <input
              type="text"
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Deposit Received</label>
            <input
              type="text"
              value={depositReceived}
              onChange={(e) => setDepositReceived(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Booking By</label>
            <input
              type="text"
              value={bookingBy}
              onChange={(e) => setBookingBy(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Billing Address</label>
            <input
              type="text"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Pax</label>
            <input
              type="number"
              value={pax}
              onChange={(e) => setPax(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Sales In Charge</label>
            <input
              type="text"
              value={salesInCharge}
              onChange={(e) => setSalesInCharge(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contact Person</label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </div>
          <div>
            <label>List Event</label>
            <input
              type="text"
              value={listEvent}
              onChange={(e) => setListEvent(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Rundowns Section */}
          <h3>Rundowns</h3>
          {rundowns.map((rundown, index) => (
            <div key={index}>
              <label>Rundown Date</label>
              <input
                type="date"
                value={rundown.rundown_date}
                onChange={(e) => {
                  const updatedRundowns = [...rundowns];
                  updatedRundowns[index].rundown_date = e.target.value;
                  setRundowns(updatedRundowns);
                }}
                required
              />
              <label>Time Start</label>
              <input
                type="time"
                value={rundown.time_start}
                onChange={(e) => {
                  const updatedRundowns = [...rundowns];
                  updatedRundowns[index].time_start = e.target.value;
                  setRundowns(updatedRundowns);
                }}
                required
              />
              <label>Time End</label>
              <input
                type="time"
                value={rundown.time_end}
                onChange={(e) => {
                  const updatedRundowns = [...rundowns];
                  updatedRundowns[index].time_end = e.target.value;
                  setRundowns(updatedRundowns);
                }}
                required
              />
              <label>Event Activity</label>
              <input
                type="text"
                value={rundown.event_activity}
                onChange={(e) => {
                  const updatedRundowns = [...rundowns];
                  updatedRundowns[index].event_activity = e.target.value;
                  setRundowns(updatedRundowns);
                }}
                required
              />
              {index > 0 && (
                <button type="button" onClick={() => removeRundown(index)}>
                  Remove Rundown
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addRundown}>
            Add Rundown
          </button>

          {/* Jobdesks Section */}
          <h3>Jobdesks</h3>
          {jobdesks.map((jobdesk, index) => (
            <div key={index}>
              <label>Department Name:</label>
              <select
                value={jobdesk.department_name}
                onChange={(e) => {
                  const updatedJobdesks = [...jobdesks];
                  updatedJobdesks[index].department_name = e.target.value;
                  setJobdesks(updatedJobdesks);
                }}
                required
              >
                {departments.map((dept, i) => (
                  <option key={i} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <label>Description</label>
              <input
                type="text"
                value={jobdesk.description}
                onChange={(e) => {
                  const updatedJobdesks = [...jobdesks];
                  updatedJobdesks[index].description = e.target.value;
                  setJobdesks(updatedJobdesks);
                }}
                required
              />
              <label>Notes</label>
              <input
                type="text"
                value={jobdesk.notes}
                onChange={(e) => {
                  const updatedJobdesks = [...jobdesks];
                  updatedJobdesks[index].notes = e.target.value;
                  setJobdesks(updatedJobdesks);
                }}
                required
              />
              <label>People In Charge</label>
              <input
                type="text"
                value={jobdesk.people_in_charge}
                onChange={(e) => {
                  const updatedJobdesks = [...jobdesks];
                  updatedJobdesks[index].people_in_charge = e.target.value;
                  setJobdesks(updatedJobdesks);
                }}
                required
              />
              {index > 0 && (
                <button type="button" onClick={() => removeJobdesk(index)}>
                  Remove Jobdesk
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addJobdesk}>
            Add Jobdesk
          </button>

          <button type="submit">Preview</button>
        </form>
      ) : (
        <div>
          <h3>Preview Event</h3>
          <p>
            <strong>Ref No:</strong> {refNo}
          </p>
          <p>
            <strong>Booking By:</strong> {bookingBy}
          </p>
          <p>
            <strong>Pax:</strong> {pax}
          </p>
          <p>
            <strong>Venue:</strong> {venue}
          </p>
          <p>
            <strong>Note:</strong> {note}
          </p>

          <h4>Rundowns:</h4>
          <ul>
            {rundowns.map((rundown, index) => (
              <li key={index}>
                {rundown.rundown_date} - {rundown.time_start} to{" "}
                {rundown.time_end}: {rundown.event_activity}
              </li>
            ))}
          </ul>

          <h4>Jobdesks:</h4>
          <ul>
            {jobdesks.map((jobdesk, index) => (
              <li key={index}>
                {jobdesk.department_name}: {jobdesk.description}, Notes:{" "}
                {jobdesk.notes}, In Charge: {jobdesk.people_in_charge}
              </li>
            ))}
          </ul>

          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleSaveToDatabase}>Save</button>
        </div>
      )}
    </div>
  );
}

export default EventForm;
