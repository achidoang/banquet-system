import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill stylesheet
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

function EventEdit() {
  const { id } = useParams();
  const [eventData, setEventData] = useState({
    ref_no: "",
    deposit_received: "",
    booking_by: "",
    billing_address: "",
    start_date: "",
    end_date: "",
    pax: 0,
    venue: "",
    sales_in_charge: "",
    contact_person: "",
    list_event: "",
    status: "pending",
    note: "",
    rundowns: [
      {
        rundown_date: "",
        time_start: "",
        time_end: "",
        venue_rundown: "",
        event_activity: "",
      },
    ],
    jobdesks: [
      { department_name: "", description: "", notes: "", people_in_charge: "" },
    ],
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

  const departments = [
    "Educator",
    "RA class",
    "Shop",
    "Herbal",
    "Outdoor Program",
    "Reservasi Glamping",
    "Guest Agent Glamping",
    "HK",
    "Kitchen",
    "Bar",
    "Service/Banquet",
    "Garden",
    "Ticketing",
    "Security",
    "Atsiri Jawa",
    "IT",
    "Engineering",
  ];

  const list_venue = [
    "RA Class",
    "Amphiteater",
    "Aromatic Garden",
    "Parkir Timur",
    "Aromatik Shop",
    "Merchandise Shop",
    "Lobby Utama",
    "Workshop 1",
    "Workshop 2",
    "Rooftop",
    "Rosemary 3",
    "Indoor resto",
    "Outdoor Resto",
    "Ballroom",
    "Swimming Pool",
  ];

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

  const addRundown = () => {
    setEventData({
      ...eventData,
      rundowns: [
        ...eventData.rundowns,
        {
          rundown_date: "",
          time_start: "",
          time_end: "",
          venue_rundown: "",
          event_activity: "",
        },
      ],
    });
  };

  const removeRundown = (index) => {
    const updatedRundowns = eventData.rundowns.filter((_, i) => i !== index);
    setEventData({ ...eventData, rundowns: updatedRundowns });
  };

  const addJobdesk = () => {
    setEventData({
      ...eventData,
      jobdesks: [
        ...eventData.jobdesks,
        {
          department_name: "",
          description: "",
          notes: "",
          people_in_charge: "",
        },
      ],
    });
  };

  const removeJobdesk = (index) => {
    const updatedJobdesks = eventData.jobdesks.filter((_, i) => i !== index);
    setEventData({ ...eventData, jobdesks: updatedJobdesks });
  };

  return (
    <Container>
      <Typography className="mt-4" variant="h4" gutterBottom>
        Edit Event
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ref No"
              variant="outlined"
              fullWidth
              value={eventData.ref_no}
              onChange={(e) =>
                setEventData({ ...eventData, ref_no: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Deposit Received"
              variant="outlined"
              fullWidth
              value={eventData.deposit_received}
              onChange={(e) =>
                setEventData({ ...eventData, deposit_received: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Booking By"
              variant="outlined"
              fullWidth
              value={eventData.booking_by}
              onChange={(e) =>
                setEventData({ ...eventData, booking_by: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Billing Address"
              variant="outlined"
              fullWidth
              value={eventData.billing_address}
              onChange={(e) =>
                setEventData({ ...eventData, billing_address: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              type="date"
              variant="outlined"
              fullWidth
              value={eventData.start_date}
              onChange={(e) =>
                setEventData({ ...eventData, start_date: e.target.value })
              }
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
              value={eventData.end_date}
              onChange={(e) =>
                setEventData({ ...eventData, end_date: e.target.value })
              }
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
              value={eventData.pax}
              onChange={(e) =>
                setEventData({ ...eventData, pax: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Venue"
              variant="outlined"
              fullWidth
              value={eventData.venue}
              onChange={(e) =>
                setEventData({ ...eventData, venue: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sales In Charge"
              variant="outlined"
              fullWidth
              value={eventData.sales_in_charge}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  sales_in_charge: e.target.value,
                })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Person"
              variant="outlined"
              fullWidth
              value={eventData.contact_person}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  contact_person: e.target.value,
                })
              }
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="List Event"
              variant="outlined"
              fullWidth
              value={eventData.list_event}
              onChange={(e) =>
                setEventData({ ...eventData, list_event: e.target.value })
              }
              required
            />
          </Grid>

          {/* Rundowns Section */}
          <Grid item xs={12}>
            <Typography variant="h6">Rundowns</Typography>
            {eventData.rundowns.map((rundown, index) => (
              <Box key={index} mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Rundown Date"
                      type="date"
                      fullWidth
                      value={rundown.rundown_date}
                      onChange={(e) => {
                        const updatedRundowns = [...eventData.rundowns];
                        updatedRundowns[index].rundown_date = e.target.value;
                        setEventData({
                          ...eventData,
                          rundowns: updatedRundowns,
                        });
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
                        const updatedRundowns = [...eventData.rundowns];
                        updatedRundowns[index].time_start = e.target.value;
                        setEventData({
                          ...eventData,
                          rundowns: updatedRundowns,
                        });
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
                        const updatedRundowns = [...eventData.rundowns];
                        updatedRundowns[index].time_end = e.target.value;
                        setEventData({
                          ...eventData,
                          rundowns: updatedRundowns,
                        });
                      }}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Venue</InputLabel>
                      <Select
                        value={rundown.venue_rundown}
                        onChange={(e) => {
                          const updatedRundowns = [...eventData.rundowns];
                          updatedRundowns[index].venue_rundown = e.target.value;
                          setEventData({
                            ...eventData,
                            rundowns: updatedRundowns,
                          });
                        }}
                        required
                      >
                        {list_venue.map((ven, i) => (
                          <MenuItem key={i} value={ven}>
                            {ven}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Event Activity"
                      fullWidth
                      value={rundown.event_activity}
                      onChange={(e) => {
                        const updatedRundowns = [...eventData.rundowns];
                        updatedRundowns[index].event_activity = e.target.value;
                        setEventData({
                          ...eventData,
                          rundowns: updatedRundowns,
                        });
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeRundown(index)}
                    >
                      Remove Rundown
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button variant="outlined" onClick={addRundown}>
              Add Rundown
            </Button>
          </Grid>

          {/* Jobdesks Section */}
          <Grid item xs={12}>
            <Typography className="mb-3" variant="h6">
              Jobdesks
            </Typography>
            {eventData.jobdesks.map((jobdesk, index) => (
              <Box key={index} mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Department Name</InputLabel>
                      <Select
                        value={jobdesk.department_name}
                        onChange={(e) => {
                          const updatedJobdesks = [...eventData.jobdesks];
                          updatedJobdesks[index].department_name =
                            e.target.value;
                          setEventData({
                            ...eventData,
                            jobdesks: updatedJobdesks,
                          });
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
                      label="Notes"
                      fullWidth
                      value={jobdesk.notes}
                      onChange={(e) => {
                        const updatedJobdesks = [...eventData.jobdesks];
                        updatedJobdesks[index].notes = e.target.value;
                        setEventData({
                          ...eventData,
                          jobdesks: updatedJobdesks,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="People In Charge"
                      fullWidth
                      value={jobdesk.people_in_charge}
                      onChange={(e) => {
                        const updatedJobdesks = [...eventData.jobdesks];
                        updatedJobdesks[index].people_in_charge =
                          e.target.value;
                        setEventData({
                          ...eventData,
                          jobdesks: updatedJobdesks,
                        });
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ReactQuill
                      label="Notes"
                      fullWidth
                      value={jobdesk.description}
                      onChange={(e) => {
                        const updatedJobdesks = [...eventData.jobdesks];
                        updatedJobdesks[index].description = e.target.value;
                        setEventData({
                          ...eventData,
                          jobdesks: updatedJobdesks,
                        });
                      }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeJobdesk(index)}
                    >
                      Remove Jobdesk
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button variant="outlined" onClick={addJobdesk}>
              Add Jobdesk
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Update Event
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default EventEdit;
