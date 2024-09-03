import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Typography } from "@mui/material";

function Calendar({ events }) {
  console.log("Calenderevents", events);
  const getColorByType = (type) => {
    switch (type) {
      case "food":
        return "green";
      case "medicine":
        return "green";
      case "education":
        return "green";
      case "cash":
        return "green";
      case "other-items":
        return "green";
      default:
        return "gray";
    }
  };

  // Format your data into FullCalendar events
  const formattedEvents = events.map((event) => ({
    title: event.name,
    contactNumber: event.contactNumber,
    start: event.donationDate,
    backgroundColor: getColorByType(event.type),
    borderColor: getColorByType(event.type),
    extendedProps: {
      type: event.type,
      email: event.email,
    },
  }));

  // Custom event rendering function
  const eventContent = (arg) => {
    const customStyles = {
      color: "white",
      fontSize: "10px",
    };

    return (
      <Box>
        <Typography style={customStyles}>{arg.event.title}</Typography>
        <Typography style={customStyles}>
          {arg.event.extendedProps.contactNumber}
        </Typography>
        <Typography style={customStyles}>
          {arg.event.extendedProps.type}
        </Typography>
        <Typography style={customStyles}>
          {arg.event.extendedProps.email}
        </Typography>
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
        events={formattedEvents} // Pass the formatted events array to the FullCalendar component
        eventContent={eventContent} // Use the custom event rendering function
      />
    </div>
  );
}

export default Calendar;
