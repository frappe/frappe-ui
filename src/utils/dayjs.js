import _dayjs from 'dayjs/esm'
import relativeTime from 'dayjs/esm/plugin/relativeTime'
import localizedFormat from 'dayjs/esm/plugin/localizedFormat'
import updateLocale from 'dayjs/esm/plugin/updateLocale'
import isToday from 'dayjs/esm/plugin/isToday'
import duration from 'dayjs/esm/plugin/duration'
import utc from 'dayjs/esm/plugin/utc'
import timezone from 'dayjs/esm/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { getConfig } from './config'

_dayjs.extend(updateLocale)
_dayjs.extend(relativeTime)
_dayjs.extend(localizedFormat)
_dayjs.extend(isToday)
_dayjs.extend(duration)
_dayjs.extend(utc)
_dayjs.extend(timezone)
_dayjs.extend(advancedFormat)

// to clear datetime field set now to false
export function dayjsLocal(dateTimeString, now = true) {
  let tz = getConfig('timezone')

  if (!tz?.system && !tz?.user)
    return !now && !dateTimeString ? null : _dayjs(dateTimeString)

  if (!dateTimeString) return now ? _dayjs().tz(tz.user) : null
  return _dayjs.tz(dateTimeString, tz.system).tz(tz.user)
}

export function dayjsSystem(dateTimeString, now = true) {
  let tz = getConfig('timezone')

  if (!tz?.system && !tz?.user)
    return !now && !dateTimeString ? null : _dayjs(dateTimeString)

  if (!dateTimeString) return now ? _dayjs().tz(tz.system) : null
  return _dayjs.tz(dateTimeString, tz.user).tz(tz.system)
}

export let dayjs = _dayjs
