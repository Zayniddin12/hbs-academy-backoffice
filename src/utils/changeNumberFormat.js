export const changeNumberFormat = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
export function hashPhoneNumber(input) {
  const numericOnly = input.replace(/\D/g, "");
  if (numericOnly.length !== 12) {
    console.error("Invalid phone number format");
    return input;
  }
  const formattedNumber = `+${numericOnly.slice(
    0,
    5
  )} *** ** ${numericOnly.slice(10, 12)}`;
  return formattedNumber;
}
export function convertSecondsToHMS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const remainingSecondsAfterHours = seconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const remainingSeconds = remainingSecondsAfterHours % 60;
  return {
    hours: hours,
    minutes: minutes,
    seconds: remainingSeconds,
  };
}
//# sourceMappingURL=changeNumberFormat.js.map
