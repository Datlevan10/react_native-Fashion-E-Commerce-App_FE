export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
};

const getMonthName = (monthNumber) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[monthNumber - 1];
};

export const formatDateLong = (dateString) => {
  const formattedDate = formatDate(dateString);
  const [day, month, year] = formattedDate.split("/");
  return `${getMonthName(Number(month))} ${day}, ${year}`;
};
