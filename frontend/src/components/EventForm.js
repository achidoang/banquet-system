import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Container,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material"; // Material UI Components
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for layout

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
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Event
      </Typography>
      {!previewMode ? (
        <form onSubmit={handlePreview}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ref No"
                variant="outlined"
                fullWidth
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Deposit Received"
                variant="outlined"
                fullWidth
                value={depositReceived}
                onChange={(e) => setDepositReceived(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Booking By"
                variant="outlined"
                fullWidth
                value={bookingBy}
                onChange={(e) => setBookingBy(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Billing Address"
                variant="outlined"
                fullWidth
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                type="date"
                variant="outlined"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                type="date"
                variant="outlined"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pax"
                type="number"
                variant="outlined"
                fullWidth
                value={pax}
                onChange={(e) => setPax(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Venue"
                variant="outlined"
                fullWidth
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sales In Charge"
                variant="outlined"
                fullWidth
                value={salesInCharge}
                onChange={(e) => setSalesInCharge(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact Person"
                variant="outlined"
                fullWidth
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="List Event"
                variant="outlined"
                fullWidth
                value={listEvent}
                onChange={(e) => setListEvent(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Note"
                variant="outlined"
                fullWidth
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Grid>

            {/* Rundowns Section */}
            <Grid item xs={12}>
              <Typography variant="h6">Rundowns</Typography>
              {rundowns.map((rundown, index) => (
                <Box key={index} mb={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Rundown Date"
                        type="date"
                        fullWidth
                        value={rundown.rundown_date}
                        onChange={(e) => {
                          const updatedRundowns = [...rundowns];
                          updatedRundowns[index].rundown_date = e.target.value;
                          setRundowns(updatedRundowns);
                        }}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Time Start"
                        type="time"
                        fullWidth
                        value={rundown.time_start}
                        onChange={(e) => {
                          const updatedRundowns = [...rundowns];
                          updatedRundowns[index].time_start = e.target.value;
                          setRundowns(updatedRundowns);
                        }}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Time End"
                        type="time"
                        fullWidth
                        value={rundown.time_end}
                        onChange={(e) => {
                          const updatedRundowns = [...rundowns];
                          updatedRundowns[index].time_end = e.target.value;
                          setRundowns(updatedRundowns);
                        }}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Event Activity"
                        variant="outlined"
                        fullWidth
                        value={rundown.event_activity}
                        onChange={(e) => {
                          const updatedRundowns = [...rundowns];
                          updatedRundowns[index].event_activity =
                            e.target.value;
                          setRundowns(updatedRundowns);
                        }}
                        required
                      />
                    </Grid>
                  </Grid>
                  {index > 0 && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeRundown(index)}
                    >
                      Remove Rundown
                    </Button>
                  )}
                </Box>
              ))}
              <Button variant="contained" onClick={addRundown}>
                Add Rundown
              </Button>
            </Grid>

            {/* Jobdesks Section */}
            <Grid item xs={12}>
              <Typography variant="h6">Jobdesks</Typography>
              {jobdesks.map((jobdesk, index) => (
                <Box key={index} mb={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>Department Name</InputLabel>
                        <Select
                          value={jobdesk.department_name}
                          onChange={(e) => {
                            const updatedJobdesks = [...jobdesks];
                            updatedJobdesks[index].department_name =
                              e.target.value;
                            setJobdesks(updatedJobdesks);
                          }}
                          required
                        >
                          {departments.map((dept, i) => (
                            <MenuItem key={i} value={dept}>
                              {dept}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="People In Charge"
                        variant="outlined"
                        fullWidth
                        value={jobdesk.people_in_charge}
                        onChange={(e) => {
                          const updatedJobdesks = [...jobdesks];
                          updatedJobdesks[index].people_in_charge =
                            e.target.value;
                          setJobdesks(updatedJobdesks);
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Notes"
                        variant="outlined"
                        fullWidth
                        value={jobdesk.notes}
                        onChange={(e) => {
                          const updatedJobdesks = [...jobdesks];
                          updatedJobdesks[index].notes = e.target.value;
                          setJobdesks(updatedJobdesks);
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={jobdesk.description}
                        onChange={(e) => {
                          const updatedJobdesks = [...jobdesks];
                          updatedJobdesks[index].description = e.target.value;
                          setJobdesks(updatedJobdesks);
                        }}
                        required
                      />
                    </Grid>
                  </Grid>
                  {index > 0 && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeJobdesk(index)}
                    >
                      Remove Jobdesk
                    </Button>
                  )}
                </Box>
              ))}
              <Button variant="contained" onClick={addJobdesk}>
                Add Jobdesk
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Preview
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <div>
          <Typography variant="h5">Preview Event</Typography>
          <p>
            <strong>Ref No:</strong> {refNo}
          </p>
          <p>
            <strong>Deposit Received:</strong> {depositReceived}
          </p>
          <p>
            <strong>Booking By:</strong> {bookingBy}
          </p>
          <p>
            <strong>Start Date:</strong> {startDate}
          </p>
          <p>
            <strong>End Date:</strong> {endDate}
          </p>
          <p>
            <strong>Pax:</strong> {pax}
          </p>
          <p>
            <strong>Sales in Charge:</strong> {salesInCharge}
          </p>
          <p>
            <strong>Contact Person:</strong> {contactPerson}
          </p>
          <p>
            <strong>List Event:</strong> {listEvent}
          </p>
          <p>
            <strong>Venue:</strong> {venue}
          </p>
          <p>
            <strong>Note:</strong> {note}
          </p>

          <Typography variant="h6">Rundowns:</Typography>
          <ul>
            {rundowns.map((rundown, index) => (
              <li key={index}>
                {rundown.rundown_date} - {rundown.time_start} to{" "}
                {rundown.time_end}: {rundown.event_activity}
              </li>
            ))}
          </ul>

          <Typography variant="h6">Jobdesks:</Typography>
          <ul>
            {jobdesks.map((jobdesk, index) => (
              <li key={index}>
                {jobdesk.department_name}: {jobdesk.description}, Notes:{" "}
                {jobdesk.notes}, In Charge: {jobdesk.people_in_charge}
              </li>
            ))}
          </ul>

          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={handleSaveToDatabase}>Save</Button>
        </div>
      )}
    </Container>
  );
}

export default EventForm;
