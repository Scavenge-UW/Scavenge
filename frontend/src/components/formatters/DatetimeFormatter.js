// reference: https://stackoverflow.com/questions/50430968/converting-string-date-in-react-javascript
/**
 * convert datetime string to desired format
 * (e.g. "2018-05-18T04:00:00.000Z" to "May 18, 2018, 4:00 AM")
 *
 * @param {*} timeString - date time string
 * @returns formatted date time string
 */
function FormatDateTime(timeString) {
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  options.timeZone = "UTC";
  // options.timeZoneName = "short";
  return new Date(timeString).toLocaleDateString(["en-US"], options);
}

// reference: https://stackoverflow.com/questions/13898423/javascript-convert-24-hour-time-of-day-string-to-12-hour-time-with-am-pm-and-no
/**
 * convert 24-hour time-of-day string to 12-hour time with AM/PM and no timezone
 *
 * @param {*} time - time string
 * @returns
 */
function FormatTime(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
    time.splice(3, 1);
  }
  console.log("TIME IS - ", time);

  return time.join(""); // return adjusted time or original string
}

const formatters = { datetime: FormatDateTime, time: FormatTime };
export default formatters;
