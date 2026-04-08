import type { Dayjs } from 'dayjs/esm'
import _dayjs from 'dayjs/esm'
import advancedFormat from 'dayjs/esm/plugin/advancedFormat'
import customParseFormat from 'dayjs/esm/plugin/customParseFormat'
import duration from 'dayjs/esm/plugin/duration'
import isToday from 'dayjs/esm/plugin/isToday'
import localizedFormat from 'dayjs/esm/plugin/localizedFormat'
import relativeTime from 'dayjs/esm/plugin/relativeTime'
import timezone from 'dayjs/esm/plugin/timezone'
import updateLocale from 'dayjs/esm/plugin/updateLocale'
import utc from 'dayjs/esm/plugin/utc'

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
