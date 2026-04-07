/** Hora permitida para inicio y fin: 04:00–20:59 (misma regla que antes). */
export function isValidTaskHour(timeStr) {
  const hour = parseInt(timeStr.split(":")[0], 10);
  return !Number.isNaN(hour) && hour >= 4 && hour < 21;
}

export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function isEndAfterStart(startStr, endStr) {
  return timeToMinutes(endStr) > timeToMinutes(startStr);
}

/** Si no hay hora fin guardada, sugerir +1 h desde inicio (tope 20:59). */
export function defaultEndFromStart(startStr) {
  const [h, mi] = startStr.split(":").map(Number);
  let total = h * 60 + mi + 60;
  const max = 20 * 60 + 59;
  if (total > max) return "20:59";
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}
