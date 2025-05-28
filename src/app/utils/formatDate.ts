export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }

  const targetDate = new Date(date);
  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `il y a ${yearsAgo} an`;
  } else if (monthsAgo > 0) {
    formattedDate = `Il y a ${monthsAgo} mois`;
  } else if (daysAgo > 0) {
    formattedDate = `Il y a ${daysAgo} jours`;
  } else {
    formattedDate = "Today";
  }

  const fullDate = targetDate.toLocaleString("fr-fr", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
