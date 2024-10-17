import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Detail.css";
import { useParams } from "react-router-dom";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material"; // Material-UI components
import { formatDate } from "./utils"; // Util function
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for layout

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [filteredJobdesks, setFilteredJobdesks] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobdesksPerPage] = useState(50); // Pagination: 5 jobdesks per page
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://192.168.0.109:5000/api/events/${id}`,
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const groupRundownByDay = (rundowns) => {
    const grouped = {};
    rundowns.forEach((rundown) => {
      const date = formatDate(rundown.rundown_date);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(rundown);
    });
    return grouped;
  };

  if (!event) return <div>Loading...</div>;

  const rundownByDay = groupRundownByDay(event.rundowns);
  const rundownDays = Object.keys(rundownByDay);

  // Pagination logic
  const indexOfLastJobdesk = currentPage * jobdesksPerPage;
  const indexOfFirstJobdesk = indexOfLastJobdesk - jobdesksPerPage;
  const currentJobdesks = filteredJobdesks.slice(
    indexOfFirstJobdesk,
    indexOfLastJobdesk
  );

  const departments = [
    "All",
    "Educator",
    "RA Class",
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

  return (
    <div className="container-fluid mt-4">
      <div className="card">
        <div className="card-body">
          <Typography
            className="text-center mb-3"
            variant="h5"
            component="h2"
            gutterBottom
          >
            BANQUET EVENT ORDER
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography className="text-start mb-3" variant="body1">
                <strong>Booked By:</strong> {event.booking_by}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="text-end mb-3" variant="body1">
                <strong>Ref No:</strong> {event.ref_no}
              </Typography>
            </Grid>
          </Grid>

          {/* Grid Layout for Event Info in 4 columns */}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: "20%" }} className="border-tebal">
                    <Typography variant="body1">
                      <strong>Billing Address:</strong> {event.billing_address}
                    </Typography>
                  </TableCell>
                  <TableCell className="border-tebal" colSpan={2}>
                    <Typography variant="body1">
                      <strong>Deposit Received:</strong>{" "}
                      {event.deposit_received}
                    </Typography>
                  </TableCell>
                  <TableCell className="border-tebal" colSpan={2}>
                    <Typography variant="body1">
                      <strong>Contact Person:</strong> {event.contact_person}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-tebal" colSpan={3}>
                    <Typography variant="body1">
                      <strong>Start Date:</strong>{" "}
                      {formatDate(event.start_date)}
                    </Typography>
                  </TableCell>
                  <TableCell className="border-tebal" colSpan={2}>
                    <Typography variant="body1">
                      <strong>Sales in Charge:</strong> {event.sales_in_charge}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-tebal" colSpan={3}>
                    <Typography variant="body1">
                      <strong>End Date:</strong> {formatDate(event.end_date)}
                    </Typography>
                  </TableCell>
                  <TableCell className="border-tebal">
                    <Typography variant="body1">
                      <strong>Pax:</strong> {event.pax}
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{ width: "25%" }}
                    className="border-tebal"
                    rowSpan={2}
                  >
                    <Typography variant="body1">
                      <strong>Venue:</strong> {event.venue}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border-tebal" colSpan={4}>
                    <Typography variant="body1">
                      <strong>Event:</strong> {event.list_event}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Rundown Section */}
          <Typography variant="h6" component="h3" gutterBottom className="mt-4">
            Rundowns
          </Typography>
          {rundownDays.map((day, index) => (
            <div key={index}>
              <Typography
                className="fw-semibold"
                variant="p"
                gutterBottom
              >{`Day ${index + 1}: ${day}`}</Typography>
              <TableContainer component={Paper} className="mb-3">
                <Table size="small" className="border-tebal">
                  <TableBody>
                    <TableRow>
                      <TableCell
                        style={{ width: "25%" }}
                        className="border-tebal text-center"
                      >
                        <Typography variant="body1">
                          <strong>Time</strong>
                        </Typography>
                      </TableCell>
                      <TableCell
                        style={{ width: "30%" }}
                        className="border-tebal text-center"
                      >
                        <Typography variant="body1">
                          <strong>Venue</strong>
                        </Typography>
                      </TableCell>
                      <TableCell
                        className="border-tebal text-center"
                        colSpan={2}
                      >
                        <Typography variant="body1">
                          <strong>Activity</strong>
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {rundownByDay[day].map((rundown, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="border-tebal text-center">
                          <Typography variant="body1">
                            {`${rundown.time_start} - ${rundown.time_end}`}
                          </Typography>
                        </TableCell>
                        <TableCell className="border-tebal text-center">
                          <Typography variant="body1">
                            {rundown.venue_rundown}
                          </Typography>
                        </TableCell>
                        <TableCell className="border-tebal">
                          <Typography variant="body1">
                            {rundown.event_activity}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))}
          {/* Jobdesk Section */}
          <Typography variant="h5" component="h3" gutterBottom className="mt-4">
            Jobdesks
          </Typography>
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

          <Grid container spacing={2}>
            {currentJobdesks.map((jobdesk, index) => (
              <Grid item xs={12} key={index}>
                <Typography variant="body1">
                  <strong>Department:</strong> {jobdesk.department_name}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong>
                  {/* Menampilkan rich text description */}
                  <div
                    className="desc"
                    dangerouslySetInnerHTML={{ __html: jobdesk.description }}
                  ></div>
                </Typography>
                <Typography variant="body1">
                  <strong>Notes:</strong> {jobdesk.notes}
                </Typography>
                <Typography variant="body1">
                  <strong>People in Charge:</strong> {jobdesk.people_in_charge}
                </Typography>
                {/* Menampilkan gambar */}
                {jobdesk.image_urls && jobdesk.image_urls.length > 0 && (
                  <div className="jobdesk-images">
                    {jobdesk.image_urls.map((imageUrl, idx) => (
                      <img
                        className="mt-2 mb-5"
                        key={idx}
                        src={`http://localhost:5000${imageUrl}`} // Menggunakan imageUrl langsung
                        alt={`jobdesk-image-${idx}`}
                      />
                    ))}
                  </div>
                )}

                <hr />
              </Grid>
            ))}
          </Grid>

          <Pagination
            count={Math.ceil(filteredJobdesks.length / jobdesksPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            className="mt-3 no-print"
          />

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
