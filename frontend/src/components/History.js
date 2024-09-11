// // src/components/History.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function History() {
//   const [events, setEvents] = useState([]);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/events", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setEvents(response.data);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//       }
//     };

//     fetchEvents();
//   }, [token]);

//   return (
//     <div>
//       <h2>Event History</h2>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Ref No</th>
//             <th>Booking By</th>
//             <th>Pax</th>
//             <th>Venue</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {events.map((event) => (
//             <tr key={event._id}>
//               <td>{event.ref_no}</td>
//               <td>{event.booking_by}</td>
//               <td>{event.pax}</td>
//               <td>{event.venue}</td>
//               <td>{event.status}</td>
//               <td>
//                 <button onClick={() => navigate(`/events/${event._id}`)}>
//                   Detail
//                 </button>
//                 {/* IT and Admin can edit and delete */}
//                 {["it", "admin"].includes(currentUser?.role) && (
//                   <>
//                     <button
//                       onClick={() => navigate(`/events/edit/${event._id}`)}
//                     >
//                       Edit
//                     </button>
//                     <button onClick={() => deleteEvent(event._id)}>
//                       Delete
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   // Delete event by id
//   const deleteEvent = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/events/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEvents(events.filter((event) => event._id !== id));
//     } catch (error) {
//       console.error("Error deleting event:", error);
//     }
//   };
// }

// export default History;
