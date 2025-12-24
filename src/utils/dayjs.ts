import _dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
import isToday from 'dayjs/plugin/isToday'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { getConfig } from './config'

_dayjs.extend(updateLocale)
_dayjs.extend(relativeTime)
_dayjs.extend(localizedFormat)
_dayjs.extend(isToday)
_dayjs.extend(duration)
_dayjs.extend(utc)
_dayjs.extend(timezone)
_dayjs.extend(advancedFormat)
_dayjs.extend(customParseFormat)

function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function dayjsLocal(dateTimeString?: string): Dayjs {
  let systemTimezone = getConfig('systemTimezone')
  let localTimezone = getConfig('localTimezone') || getBrowserTimezone()

  if (!systemTimezone) return _dayjs(dateTimeString)

  if (!dateTimeString) return _dayjs().tz(localTimezone)
  return _dayjs.tz(dateTimeString, systemTimezone).tz(localTimezone)
}

export function dayjsSystem(dateTimeString?: string): Dayjs {
  let systemTimezone = getConfig('systemTimezone')
  let localTimezone = getConfig('localTimezone') || getBrowserTimezone()

  if (!systemTimezone) return _dayjs(dateTimeString)

  if (!dateTimeString) return _dayjs().tz(systemTimezone)
  return _dayjs.tz(dateTimeString, localTimezone).tz(systemTimezone)
}

export let dayjs = _dayjs
