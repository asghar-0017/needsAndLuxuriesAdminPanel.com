import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../../assets/styles/mainScreen.css";

const FullCalendarComponent = ({ orders }) => {
  const events = orders.map((order) => ({
    title: `Order: ${order.orderStatus}`,
    start: order.orderDate,
    end: order.orderDate,
    color:
      order.orderStatus === "Pending"
        ? "yellow"
        : order.orderStatus === "Dispatched"
        ? "green"
        : "red",
  }));

  return (
    <FullCalendar
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
      ]}
      initialView="dayGridMonth"
      events={events}
      editable={false}
      selectable={true}
    />
  );
};

export default FullCalendarComponent;
