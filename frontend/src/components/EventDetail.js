import React, { useEffect, useState } from "react";
import axios from "axios";
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (!event) return <div>Loading...</div>;

  // Pagination logic
  const indexOfLastJobdesk = currentPage * jobdesksPerPage;
  const indexOfFirstJobdesk = indexOfLastJobdesk - jobdesksPerPage;
  const currentJobdesks = filteredJobdesks.slice(
    indexOfFirstJobdesk,
    indexOfLastJobdesk
  );

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
          <Typography variant="h4" component="h2" gutterBottom>
            Event Details
          </Typography>

          {/* Grid Layout for Event Info */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Ref No:</strong> {event.ref_no}
              </Typography>
              <Typography variant="body1">
                <strong>Deposit Received:</strong> {event.deposit_received}
              </Typography>
              <Typography variant="body1">
                <strong>Booking By:</strong> {event.booking_by}
              </Typography>
              <Typography variant="body1">
                <strong>Billing Address:</strong> {event.billing_address}
              </Typography>
              <Typography variant="body1">
                <strong>Start Date:</strong> {formatDate(event.start_date)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>End Date:</strong> {formatDate(event.end_date)}
              </Typography>
              <Typography variant="body1">
                <strong>Pax:</strong> {event.pax}
              </Typography>
              <Typography variant="body1">
                <strong>Venue:</strong> {event.venue}
              </Typography>
              <Typography variant="body1">
                <strong>Sales in Charge:</strong> {event.sales_in_charge}
              </Typography>
              <Typography variant="body1">
                <strong>Contact Person:</strong> {event.contact_person}
              </Typography>
            </Grid>
          </Grid>

          {/* Rundown Section */}
          <Typography variant="h5" component="h3" gutterBottom className="mt-4">
            Rundowns
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell>Venue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {event.rundowns.map((rundown, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(rundown.rundown_date)}</TableCell>
                    <TableCell>{`${rundown.time_start} - ${rundown.time_end}`}</TableCell>
                    <TableCell>{rundown.event_activity}</TableCell>
                    <TableCell>{rundown.venue_rundown}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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
                    dangerouslySetInnerHTML={{ __html: jobdesk.description }}
                  ></div>
                </Typography>
                <Typography variant="body1">
                  <strong>Notes:</strong> {jobdesk.notes}
                </Typography>
                <Typography variant="body1">
                  <strong>People in Charge:</strong> {jobdesk.people_in_charge}
                </Typography>
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
