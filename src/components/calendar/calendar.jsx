import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../../assets/styles/mainScreen.css";

const FullCalendarComponent = ({ orders }) => {
  const orderCountByDate = {};

  orders.forEach((order) => {
    const orderDate = new Date(order.orderDate).toISOString().split('T')[0]; 
    orderCountByDate[orderDate] = (orderCountByDate[orderDate] || 0) + 1; 
  });

  const events = Object.keys(orderCountByDate).map((date) => ({
    title: `Orders: ${orderCountByDate[date]}`,
    start: date, 
    end: date,   
  }));

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={false}
        selectable={true}
      />
    </div>
  );
};

export default FullCalendarComponent;
