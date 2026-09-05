export function formatDateTime(d: Date | string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(d));

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const weekdayMap: Record<string, string> = {
    Sun: '일요일',
    Mon: '월요일',
    Tue: '화요일',
    Wed: '수요일',
    Thu: '목요일',
    Fri: '금요일',
    Sat: '토요일',
  };

  const weekday = weekdayMap[get('weekday')];
  const hours = get('hour');
  const minutes = get('minute');

  return `${year}.${month}.${day} ${weekday} ${hours}:${minutes}`;
};