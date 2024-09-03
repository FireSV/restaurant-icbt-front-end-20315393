import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Typography } from "@mui/material";

function DonationCalendar({ events }) {
  // Convert the single object into an array with one element
  const formattedEvents = [events].map((event) => ({
    title: event.name,
    contactNumber: event.contactNumber,
    start: event.donationDate,
    backgroundColor: event.type,
    borderColor: event.type,
    extendedProps: {
      type: event.type,
      email: event.email,
    },
  }));

  console.log("events", events);
  console.log("formattedEvents", formattedEvents);

  // Custom event rendering function
  const eventContent = (arg) => {
    const customStyles = {
      fontSize: "20px",
      fontWeight: "bold",
      border: "2px solid #000",
      borderRadius: "5px",
      padding: "5px",
      backgroundColor: "#98e3c7",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    };

    return (
      <Box style={customStyles}>
        <Typography>{arg.event.title}</Typography>
        <Typography>{arg.event.extendedProps.contactNumber}</Typography>
        <Typography>{arg.event.extendedProps.type}</Typography>
        <Typography>{arg.event.extendedProps.email}</Typography>
      </Box>
    );
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={"90vh"}
        events={formattedEvents}
        eventContent={eventContent}
      />
    </div>
  );
}

export default DonationCalendar;
