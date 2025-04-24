import { cv as dayjs$1, cw as updateLocale, cx as relativeTime, cy as localizedFormat, cz as isToday, cA as duration, cB as utc, cC as timezone, cD as advancedFormat } from "./vendor-CR9WeEaB.js";
let config = {};
function getConfig(key) {
  return config[key] || null;
}
dayjs$1.extend(updateLocale);
dayjs$1.extend(relativeTime);
dayjs$1.extend(localizedFormat);
dayjs$1.extend(isToday);
dayjs$1.extend(duration);
dayjs$1.extend(utc);
dayjs$1.extend(timezone);
dayjs$1.extend(advancedFormat);
function getBrowserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function dayjsLocal(dateTimeString) {
  let systemTimezone = getConfig("systemTimezone");
  let localTimezone = getConfig("localTimezone") || getBrowserTimezone();
  if (!systemTimezone) return dayjs$1(dateTimeString);
  if (!dateTimeString) return dayjs$1().tz(localTimezone);
  return dayjs$1.tz(dateTimeString, systemTimezone).tz(localTimezone);
}
function dayjsSystem(dateTimeString) {
  let systemTimezone = getConfig("systemTimezone");
  let localTimezone = getConfig("localTimezone") || getBrowserTimezone();
  if (!systemTimezone) return dayjs$1(dateTimeString);
  if (!dateTimeString) return dayjs$1().tz(systemTimezone);
  return dayjs$1.tz(dateTimeString, localTimezone).tz(systemTimezone);
}
let dayjs = dayjs$1;
export {
  dayjsLocal as a,
  dayjsSystem as b,
  dayjs as d,
  getConfig as g
};
