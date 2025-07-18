export function convertTo24HourFormat(time: string | null): string | null {
  if (time && time.length > 5) {
    time = time.trim().replace(' ', '')
    const ampm = time.slice(-2)
    time = time.slice(0, -2)
    let [hour, minute] = time.split(':')
    if (ampm === 'pm' && parseInt(hour) < 12) {
      hour = (parseInt(hour) + 12).toString().padStart(2, '0')
    } else if (ampm === 'am' && hour == '12') {
      hour = '00'
    }
    time = `${hour}:${minute}`
  }
  return time
}
