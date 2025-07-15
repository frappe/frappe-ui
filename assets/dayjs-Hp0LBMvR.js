import { cH as dayjs$1, cI as updateLocale, cJ as relativeTime, cK as localizedFormat, cL as isToday, cM as duration, cN as utc, cO as timezone, cP as advancedFormat } from "./vendor-Y_wWrJTg.js";
let config = {};
function getConfig(key) {
  return config[key] ?? null;
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
