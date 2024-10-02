import * as React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import Calendar from "./Calendar";

export default function ReminderCalendar() {
  const { teacherId } = useParams(); // Get teacherId from URL parameters
  const currentMonth = dayjs().month() + 1; // Get current month (JavaScript is 0-indexed, so add 1)

  const [highlightedDates, setHighlightedDates] = React.useState([]);
  const [highlightedMessages, setHighlightedMessages] = React.useState({});

  // Fetch reminders using Axios when the component mounts
  React.useEffect(() => {
    const fetchReminders = async () => {
      try {
        const url = `https://novaainew-dvfve3g7bqbneqbv.canadacentral-01.azurewebsites.net/api/Reminder/byTeacherAndMonth?teacherId=${teacherId}&month=${currentMonth}`;
        const response = await axios.get(url);

        // Extract event information from the response
        const events = response.data.$values || [];

        // Format the dates and create messages
        const dates = [];
        const messages = {};

        events.forEach((event) => {
          const day = dayjs(event.dateAndTime).date(); // Extract day from dateAndTime
          dates.push(day);
          messages[day] = event.eventName;
        });

        setHighlightedDates(dates);
        setHighlightedMessages(messages);
      } catch (error) {
        console.error("Failed to fetch reminders:", error);
      }
    };

    fetchReminders(); // Call the function to fetch reminders
  }, [teacherId, currentMonth]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="h font-bold p-3 text-xl" style={{ textAlign: "center" }}>
        Reminders
      </h1>
      <Calendar
        monthNumber={currentMonth}
        highlightedDates={highlightedDates}
        highlightedMessages={highlightedMessages}
      />
    </div>
  );
}
