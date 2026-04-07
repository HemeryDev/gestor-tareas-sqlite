// Calendario Visual principal.
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";

export default function CalendarView() {
  const { selectedDate, setSelectedDate, tasks } = useContext(TaskContext);

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const dateStr = date.toISOString().split("T")[0];
    if (tasks?.some((task) => task.date === dateStr)) return "highlight-day";
    return null;
  };

  return (
    <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
      <Calendar onChange={setSelectedDate} value={selectedDate} tileClassName={tileClassName} />
    </div>
  );
}