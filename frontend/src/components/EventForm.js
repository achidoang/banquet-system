// frontend/src/components/EventForm.js
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill stylesheet
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Form.css";
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
  Card,
  CardContent,
  CardActions,
} from "@mui/material"; // Material UI Components
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for layout
import { formatDate } from "./utils"; // Util function

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
    {
      rundown_date: "",
      time_start: "",
      time_end: "",
      venue_rundown: "",
      event_activity: "",
    },
  ]);
  const [jobdesks, setJobdesks] = useState([
    {
      department_name: "",
      description: "",
      notes: "",
      people_in_charge: "",
      image_urls: [],
    },
  ]);

  const [previewMode, setPreviewMode] = useState(false); // For preview mode
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Validasi ukuran dan format gambar
  const validateFiles = (files) => {
    for (let file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB.");
        return false;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        alert("Only JPG, JPEG, and PNG formats are allowed.");
        return false;
      }
    }
    return true;
  };

  // Handle image upload and preview
  const handleImageUpload = (e, index) => {
    const files = Array.from(e.target.files);
    if (!validateFiles(files)) return;

    const updatedJobdesks = [...jobdesks];
    const currentImages = updatedJobdesks[index].image_urls || [];

    // Validate number of images (max 5)
    if (files.length + currentImages.length > 5) {
      alert("You can only upload up to 5 images per jobdesk.");
      return;
    }

    // Generate preview URLs for images
    const previewImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    updatedJobdesks[index].image_urls = [...currentImages, ...previewImages];
    setJobdesks(updatedJobdesks);
  };

  // Handle deleting an image from the preview
  const handleDeleteImage = (jobdeskIndex, imageIndex) => {
    const updatedJobdesks = [...jobdesks];
    updatedJobdesks[jobdeskIndex].image_urls.splice(imageIndex, 1);
    setJobdesks(updatedJobdesks);
  };

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

  // Function to add new rundown
  const addRundown = () => {
    setRundowns([
      ...rundowns,
      {
        rundown_date: "",
        time_start: "",
        time_end: "",
        venue_rundown: "",
        event_activity: "",
      },
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

  // Handle form submission
  const handleSaveToDatabase = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const eventData = {
      // Add your event form fields here
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
      jobdesks: JSON.stringify(
        jobdesks.map((jobdesk) => ({
          ...jobdesk,
          image_urls: undefined, // Remove the preview URLs
        }))
      ),
    };

    // Append form data
    formData.append("eventData", JSON.stringify(eventData));

    // Append images
    jobdesks.forEach((jobdesk, index) => {
      jobdesk.image_urls.forEach((image, i) => {
        formData.append("images", image.file);
      });
    });

    try {
      await axios.post("http://localhost:5000/api/events", eventData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Event created successfully");
      navigate("/history");
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
      <Typography className="text-center mt-4" variant="h4" gutterBottom>
        Create Event
      </Typography>
      {!previewMode ? (
        <form onSubmit={handlePreview}>
          <Grid container spacing={3}>
            {/* Ref No and Deposit */}
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

            {/* Booking Details */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Booked By"
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

            {/* Date and Pax */}
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

            {/* Venue, Sales, and Contact */}
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

            {/* List Event */}
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

            {/* Rundowns Section with Card */}
            <Grid item xs={12}>
              <Typography variant="h6">Rundowns</Typography>
              {rundowns.map((rundown, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Rundown Date"
                          type="date"
                          fullWidth
                          value={rundown.rundown_date}
                          onChange={(e) => {
                            const updatedRundowns = [...rundowns];
                            updatedRundowns[index].rundown_date =
                              e.target.value;
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
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Venue</InputLabel>
                          <Select
                            value={rundown.venue_rundown}
                            onChange={(e) => {
                              const updatedRundowns = [...rundowns];
                              updatedRundowns[index].venue_rundown =
                                e.target.value;
                              setRundowns(updatedRundowns);
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
                      <Grid item xs={12} sm={8}>
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
                  </CardContent>
                  <CardActions>
                    {index > 0 && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeRundown(index)}
                      >
                        Remove Rundown
                      </Button>
                    )}
                  </CardActions>
                </Card>
              ))}
              <Button variant="contained" onClick={addRundown}>
                Add Rundown
              </Button>
            </Grid>

            {/* Jobdesks Section */}
            <Grid item xs={12}>
              <Typography variant="h6">Jobdesks</Typography>
              {jobdesks.map((jobdesk, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
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
                          fullWidth
                          value={jobdesk.notes}
                          onChange={(e) => {
                            const updatedJobdesks = [...jobdesks];
                            updatedJobdesks[index].notes = e.target.value;
                            setJobdesks(updatedJobdesks);
                          }}
                        />
                      </Grid>
                      <Grid item xs={"12"}>
                        <ReactQuill
                          value={jobdesk.description}
                          onChange={(content) => {
                            const updatedJobdesks = [...jobdesks];
                            updatedJobdesks[index].description = content;
                            setJobdesks(updatedJobdesks);
                          }}
                          required
                        />
                      </Grid>

                      {/* Image Upload Section */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          Upload Images
                        </Typography>
                        <input
                          type="file"
                          accept="image/jpeg, image/png, image/jpg"
                          multiple
                          onChange={(e) => handleImageUpload(e, index)}
                        />
                        <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                          {jobdesk.image_urls.map((image, imgIndex) => (
                            <Box key={imgIndex} position="relative">
                              <img
                                src={image.url}
                                alt={`Preview ${imgIndex}`}
                                width={100}
                                height={100}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() =>
                                  handleDeleteImage(index, imgIndex)
                                }
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  transform: "translate(50%, -50%)",
                                }}
                              >
                                X
                              </Button>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    {index > 0 && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeJobdesk(index)}
                      >
                        Remove Jobdesk
                      </Button>
                    )}
                  </CardActions>
                </Card>
              ))}
              <Button variant="contained" onClick={addJobdesk}>
                Add Jobdesk
              </Button>
            </Grid>

            {/* Submit and Preview Buttons */}
            <Grid item xs={12} className="text-center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveToDatabase}
              >
                Save Event
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <div>
          {/* Event preview UI */}
          <Typography variant="h5" gutterBottom>
            Preview Event
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="h6">Ref No:</Typography>
              <Typography>{refNo}</Typography>

              <Typography variant="h6">Booking By:</Typography>
              <Typography>{bookingBy}</Typography>

              <Typography variant="h6">Venue:</Typography>
              <Typography>{venue}</Typography>

              <Typography variant="h6">Deposit Reveived:</Typography>
              <Typography>{depositReceived}</Typography>

              <Typography variant="h6">Start Date:</Typography>
              <Typography>{formatDate(startDate)}</Typography>

              <Typography variant="h6">End Date:</Typography>
              <Typography>{formatDate(endDate)}</Typography>

              <Typography variant="h6">Pax:</Typography>
              <Typography>{pax}</Typography>

              <Typography variant="h6">Sales in Charge:</Typography>
              <Typography>{salesInCharge}</Typography>

              <Typography variant="h6">Contact Person:</Typography>
              <Typography>{contactPerson}</Typography>

              <Typography variant="h6">List Event:</Typography>
              <Typography>{listEvent}</Typography>

              <Typography variant="h6">Sales in Charge:</Typography>
              <Typography>{salesInCharge}</Typography>

              <Typography variant="h6">Rundowns:</Typography>
              <ul>
                {rundowns.map((rundown, index) => (
                  <li key={index}>
                    {formatDate(rundown.rundown_date)} || {rundown.time_start} -{" "}
                    {rundown.time_end} || {rundown.venue_rundown} ||{" "}
                    {rundown.event_activity}
                  </li>
                ))}
              </ul>

              <Typography variant="h6">Jobdesks:</Typography>
              <ul>
                {jobdesks.map((jobdesk, index) => (
                  <li key={index}>
                    {jobdesk.department_name}:{" "}
                    {
                      <div
                        dangerouslySetInnerHTML={{
                          __html: jobdesk.description,
                        }}
                      ></div>
                    }
                    Notes: {jobdesk.notes} || People in Charge:{" "}
                    {jobdesk.people_in_charge}
                  </li>
                ))}
              </ul>

              {/* Tambahkan semua data form lainnya di sini */}
            </CardContent>
          </Card>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setPreviewMode(false)}
            sx={{ mt: 3 }}
          >
            Back to Form
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveToDatabase}
            sx={{ mt: 3, ml: 2 }}
          >
            Save to Database
          </Button>
        </div>
      )}
    </Container>
  );
}

export default EventForm;
