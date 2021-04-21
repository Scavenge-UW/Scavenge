import moment from "moment";

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

  return time.join(""); // return adjusted time or original string
}

/**
 * reference:
 *   https://stackoverflow.com/questions/22938300/convert-milliseconds-to-hours-and-minutes-using-momentjs
 * example:
 *   durationAsString(0) will return -
 *   durationAsString(10000) will return 10s
 *   durationAsString(100000) will return 1m 40s
 *   durationAsString(10000000) will return 2h 46m 40s
 *   durationAsString(100000000) will return 1d 3h 46m
 *   durationAsString(100000000, 4) will return 1d 3h 46m 40s
 *
 *
 * @param {*} receivedTime the time (in String format) when the reservation was made
 * @returns formatted time elapsed since the reservation was made.
 */
function FormatTimeElapsed(receivedTime, maxPrecission = 3) {
  // convert receivedTime to moment object
  const received = moment(new Date(receivedTime), "YYYY/MM/DD HH:mm:ss");
  const current = moment(new Date(), "YYYY/MM/DD HH:mm:ss");

  // calculate time elapsed and formatting
  const duration = moment.duration(current - received);
  const items = [];
  items.push({ timeUnit: "d", value: Math.floor(duration.asDays()) });
  items.push({ timeUnit: "h", value: duration.hours() });
  items.push({ timeUnit: "m", value: duration.minutes() });
  items.push({ timeUnit: "s", value: duration.seconds() });

  const formattedItems = items.reduce((accumulator, { value, timeUnit }) => {
    if (
      accumulator.length >= maxPrecission ||
      (accumulator.length === 0 && value === 0)
    ) {
      return accumulator;
    }

    accumulator.push(`${value}${timeUnit}`);
    return accumulator;
  }, []);

  return formattedItems.length !== 0 ? formattedItems.join(" ") : "-";
}

/**
 * return time elapsed since reservation received time
 *
 * @param {*} receivedTime - reservation received time in format as 'yyyy-mm-ddThh:mm:ss.msZ'
 * @param {*} unit - unit of time like days/hours/minutes/seconds
 * @returns time elapsed since reservation received time
 */
function getTimeElapsed(receivedTime, unit) {
  // convert receivedTime to moment object
  const received = moment(new Date(receivedTime), "YYYY/MM/DD HH:mm:ss");
  const current = moment(new Date(), "YYYY/MM/DD HH:mm:ss");

  return current.diff(received, unit);
}

const formatters = {
  datetime: FormatDateTime,
  time: FormatTime,
  formatTimeElapsed: FormatTimeElapsed,
  getTimeElapsed: getTimeElapsed,
};

export default formatters;
