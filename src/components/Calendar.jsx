import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";

import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarModal from "./CalendarModal";

import { onSnapshot } from "firebase/firestore";
import { agendaDocs } from "../utils/firebase";

const MyCalendar = () => {
  const [events, setEvents] = useState();
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState();

  const selectEvent = (e) => {
    setShow(true);
    setModalData(e);
  };

  const locales = {
    "en-US": enUS,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  useEffect(() => {
    const newEvents = [];
    const unsubscribe = onSnapshot(agendaDocs, (doc) => {
      doc.docs.map((doc) => {
        let events = doc.data();
        events.start = events.start.toDate();
        events.end = events.end.toDate();
        newEvents.push(events);
      });
      setEvents(newEvents);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(e) => selectEvent(e)}
      />
      <CalendarModal show={show} setShow={setShow} item={modalData} />
    </>
  );
};

export default MyCalendar;
