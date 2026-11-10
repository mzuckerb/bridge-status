export const TIMEZONE = 'Asia/Jerusalem';

/**
 * Gets the current time components in Asia/Jerusalem timezone
 */
export function getJerusalemDate(date: Date = new Date()): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, number> = {};
  for (const p of parts) {
    if (p.type !== 'literal') {
      partMap[p.type] = parseInt(p.value, 10);
    }
  }

  return {
    year: partMap.year ?? date.getFullYear(),
    month: (partMap.month ?? (date.getMonth() + 1)) - 1, // 0-indexed month
    day: partMap.day ?? date.getDate(),
    hour: partMap.hour === 24 ? 0 : (partMap.hour ?? date.getHours()),
    minute: partMap.minute ?? date.getMinutes(),
    second: partMap.second ?? date.getSeconds(),
  };
}

/**
 * Calculates the next upcoming check time (07:00 or 17:00 Israel Time)
 */
export function getNextScheduledCheck(now: Date = new Date()): Date {
  const j = getJerusalemDate(now);

  let targetHour = 7;
  let dayOffset = 0;

  if (j.hour < 7) {
    targetHour = 7;
    dayOffset = 0;
  } else if (j.hour < 17) {
    targetHour = 17;
    dayOffset = 0;
  } else {
    // Past 17:00, next is tomorrow at 07:00
    targetHour = 7;
    dayOffset = 1;
  }

  // Create an approximate ISO target string in Israel offset
  // Format: YYYY-MM-DDTHH:00:00
  const targetDateObj = new Date(Date.UTC(j.year, j.month, j.day + dayOffset, 0, 0, 0));
  
  // Convert target to proper UTC instant by checking timezone offset
  const targetStr = `${targetDateObj.getUTCFullYear()}-${String(targetDateObj.getUTCMonth() + 1).padStart(2, '0')}-${String(targetDateObj.getUTCDate()).padStart(2, '0')} ${String(targetHour).padStart(2, '0')}:00:00`;
  
  // Approximate with standard date construction in local time
  const estimated = new Date(now.getTime());
  // Adjust day & hour
  if (dayOffset > 0) {
    estimated.setDate(estimated.getDate() + dayOffset);
  }
  estimated.setHours(targetHour, 0, 0, 0);

  return estimated;
}

/**
 * Formats an ISO date into Hebrew and English friendly strings in Israel Time
 */
export function formatIsraelDateTime(isoString: string): {
  hebrew: string;
  english: string;
} {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return { hebrew: 'לא ידוע', english: 'Unknown' };
  }

  const heFormatter = new Intl.DateTimeFormat('he-IL', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const enFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    hebrew: heFormatter.format(date),
    english: enFormatter.format(date),
  };
}
