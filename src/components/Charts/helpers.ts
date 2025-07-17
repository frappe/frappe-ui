import { dayjs } from '../../utils/dayjs'

export function formatLabel(name: string) {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export type TimeGrain =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
export function formatDate(date: string, format?: string, grain: TimeGrain = 'day') {
  if (!date) return ''

  if (grain) {
    const grainToFormat: Record<TimeGrain, string> = {
      second: 'MMMM D, YYYY h:mm:ss A',
      minute: 'MMMM D, YYYY h:mm A',
      hour: 'MMMM D, YYYY h:00 A',
      day: 'MMMM D, YYYY',
      week: 'MMM Do, YYYY',
      month: 'MMMM, YYYY',
      year: 'YYYY',
      quarter: '[Q]Q, YYYY',
    }

    format = grainToFormat[grain]
  }

  if (!format) {
    format = 'MMM D, YY'
  }

  return dayjs(date).format(format)
}


export function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export function mergeDeep(target: any, ...sources: any[]) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (!source || !isObject(target) || !isObject(source)) {
    // Skip the current source if it's not a proper object
    return mergeDeep(target, ...sources);
  }

  let output = Object.assign({}, target);

  Object.keys(source).forEach((key) => {
    if (isObject(source[key])) {
      if (!(key in output)) {
        output[key] = source[key];
      } else {
        output[key] = mergeDeep(output[key], source[key]);
      }
    } else {
      output[key] = source[key];
    }
  });

  return mergeDeep(output, ...sources);
}
