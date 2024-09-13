import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EventEdit() {
  const { id } = useParams();
  const [eventData, setEventData] = useState({
    ref_no: "",
    deposite_received: "",
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
      { rundown_date: "", time_start: "", time_end: "", event_activity: "" },
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

  // Function to handle form submission
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

  // Function to add new rundown
  const addRundown = () => {
    setEventData({
      ...eventData,
      rundowns: [
        ...eventData.rundowns,
        { rundown_date: "", time_start: "", time_end: "", event_activity: "" },
      ],
    });
  };

  // Function to remove rundown
  const removeRundown = (index) => {
    const updatedRundowns = eventData.rundowns.filter((_, i) => i !== index);
    setEventData({ ...eventData, rundowns: updatedRundowns });
  };

  // Function to add new jobdesk
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

  // Function to remove jobdesk
  const removeJobdesk = (index) => {
    const updatedJobdesks = eventData.jobdesks.filter((_, i) => i !== index);
    setEventData({ ...eventData, jobdesks: updatedJobdesks });
  };

  return (
    <div>
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ref No:</label>
          <input
            type="text"
            value={eventData.ref_no}
            onChange={(e) =>
              setEventData({ ...eventData, ref_no: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Deposite Received:</label>
          <input
            type="text"
            value={eventData.deposite_received}
            onChange={(e) =>
              setEventData({ ...eventData, deposite_received: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Booking By:</label>
          <input
            type="text"
            value={eventData.booking_by}
            onChange={(e) =>
              setEventData({ ...eventData, booking_by: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Billing Address:</label>
          <input
            type="text"
            value={eventData.billing_address}
            onChange={(e) =>
              setEventData({ ...eventData, billing_address: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="text"
            value={eventData.start_date}
            onChange={(e) =>
              setEventData({ ...eventData, start_date: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="text"
            value={eventData.end_date}
            onChange={(e) =>
              setEventData({ ...eventData, end_date: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Pax:</label>
          <input
            type="number"
            value={eventData.pax}
            onChange={(e) =>
              setEventData({ ...eventData, pax: parseInt(e.target.value) })
            }
            required
          />
        </div>
        <div>
          <label>Venue:</label>
          <input
            type="text"
            value={eventData.venue}
            onChange={(e) =>
              setEventData({ ...eventData, venue: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Sales in Charge:</label>
          <input
            type="text"
            value={eventData.sales_in_charge}
            onChange={(e) =>
              setEventData({ ...eventData, sales_in_charge: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Contact Person:</label>
          <input
            type="text"
            value={eventData.contact_person}
            onChange={(e) =>
              setEventData({ ...eventData, contact_person: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>List event:</label>
          <input
            type="text"
            value={eventData.list_event}
            onChange={(e) =>
              setEventData({ ...eventData, list_event: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="text"
            value={eventData.status}
            onChange={(e) =>
              setEventData({ ...eventData, status: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Note:</label>
          <input
            type="text"
            value={eventData.note}
            onChange={(e) =>
              setEventData({ ...eventData, note: e.target.value })
            }
            required
          />
        </div>

        {/* Rundown Section */}
        <h3>Rundowns</h3>
        {eventData.rundowns.map((rundown, index) => (
          <div key={index}>
            <label>Date:</label>
            <input
              type="date"
              value={rundown.rundown_date}
              onChange={(e) => {
                const updatedRundowns = [...eventData.rundowns];
                updatedRundowns[index].rundown_date = e.target.value;
                setEventData({ ...eventData, rundowns: updatedRundowns });
              }}
              required
            />
            <label>Start Time:</label>
            <input
              type="time"
              value={rundown.time_start}
              onChange={(e) => {
                const updatedRundowns = [...eventData.rundowns];
                updatedRundowns[index].time_start = e.target.value;
                setEventData({ ...eventData, rundowns: updatedRundowns });
              }}
              required
            />
            <label>End Time:</label>
            <input
              type="time"
              value={rundown.time_end}
              onChange={(e) => {
                const updatedRundowns = [...eventData.rundowns];
                updatedRundowns[index].time_end = e.target.value;
                setEventData({ ...eventData, rundowns: updatedRundowns });
              }}
              required
            />
            <label>Activity:</label>
            <input
              type="text"
              value={rundown.event_activity}
              onChange={(e) => {
                const updatedRundowns = [...eventData.rundowns];
                updatedRundowns[index].event_activity = e.target.value;
                setEventData({ ...eventData, rundowns: updatedRundowns });
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

        {/* Jobdesk Section */}
        <h3>Jobdesks</h3>
        {eventData.jobdesks.map((jobdesk, index) => (
          <div key={index}>
            <label>Department Name:</label>
            <input
              type="text"
              value={jobdesk.department_name}
              onChange={(e) => {
                const updatedJobdesks = [...eventData.jobdesks];
                updatedJobdesks[index].department_name = e.target.value;
                setEventData({ ...eventData, jobdesks: updatedJobdesks });
              }}
              required
            />
            <label>Description:</label>
            <input
              type="text"
              value={jobdesk.description}
              onChange={(e) => {
                const updatedJobdesks = [...eventData.jobdesks];
                updatedJobdesks[index].description = e.target.value;
                setEventData({ ...eventData, jobdesks: updatedJobdesks });
              }}
              required
            />
            <label>Notes:</label>
            <input
              type="text"
              value={jobdesk.notes}
              onChange={(e) => {
                const updatedJobdesks = [...eventData.jobdesks];
                updatedJobdesks[index].notes = e.target.value;
                setEventData({ ...eventData, jobdesks: updatedJobdesks });
              }}
              required
            />
            <label>In Charge:</label>
            <input
              type="text"
              value={jobdesk.people_in_charge}
              onChange={(e) => {
                const updatedJobdesks = [...eventData.jobdesks];
                updatedJobdesks[index].people_in_charge = e.target.value;
                setEventData({ ...eventData, jobdesks: updatedJobdesks });
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

        <button type="submit">Update Event</button>
      </form>
    </div>
  );
}

export default EventEdit;
