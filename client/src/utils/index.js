export const daysLeft = (deadline) => {
  // deadline from contract is in seconds → convert to milliseconds
  const difference = deadline * 1000 - Date.now();

  // calculate remaining days
  const remainingDays = Math.ceil(difference / (1000 * 60 * 60 * 24));

  // never show negative numbers
  return remainingDays > 0 ? remainingDays : 0;
};


export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};