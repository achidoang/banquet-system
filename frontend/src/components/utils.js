// utils.js
export const formatDate = (dateString) => {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options); // Format Sabtu, 14 September 2024
};

export const formatTime = (timeString) => {
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return new Date(`1970-01-01T${timeString}Z`).toLocaleTimeString(
    "en-US",
    options
  ); // Format HH:MM AM/PM
};
