// utils.js
export const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options); // Format dd/mm/yyyy
};

export const formatTime = (timeString) => {
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return new Date(`1970-01-01T${timeString}Z`).toLocaleTimeString(
    "en-US",
    options
  ); // Format HH:MM AM/PM
};
