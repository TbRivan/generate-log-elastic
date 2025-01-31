export const formatDate = (date) => {
  const newDate = new Date(date);
  return `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(newDate.getDate()).padStart(2, "0")}`;
};

export const beautyDate = (value, year) => {
  const [date, time] = value[0].split(" ");
  const [day, month] = date.split("/");
  const dateTime = `${year}-${month}-${day}`;

  return `${dateTime} ${time}`;
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
