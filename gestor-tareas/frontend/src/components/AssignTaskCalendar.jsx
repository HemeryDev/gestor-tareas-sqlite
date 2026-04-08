
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";

export function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function AssignTaskCalendar({ selectedDates, onToggleDay }) {
  const { tasks } = useContext(TaskContext);

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const ymd = toYMD(date);
    const parts = [];
    if (selectedDates.includes(ymd)) parts.push("assign-day-selected");
    if (tasks.some((t) => t.date === ymd)) parts.push("highlight-day");
    return parts.length ? parts.join(" ") : null;
  };

  return (
    <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <Calendar onClickDay={(d) => onToggleDay(d)} tileClassName={tileClassName} />
    </div>
  );
}
