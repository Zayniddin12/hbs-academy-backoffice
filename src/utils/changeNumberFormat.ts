export const changeNumberFormat = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
export function hashPhoneNumber(input: string) {
  // Remove non-numeric characters
  const numericOnly = input.replace(/\D/g, "");

  // Check if the input is a valid phone number
  if (numericOnly.length !== 12) {
    console.error("Invalid phone number format");
    return input; // return the original input if it's not a valid phone number
  }

  // Format the phone number
  const formattedNumber = `+${numericOnly.slice(
    0,
    5
  )} *** ** ${numericOnly.slice(10, 12)}`;
  return formattedNumber;
}
export function convertSecondsToHMS(seconds: number) {
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
