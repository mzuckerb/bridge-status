export const TIMEZONE = 'Asia/Jerusalem';

export interface JerusalemParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

/**
 * Gets the current date/time components in Asia/Jerusalem timezone
 */
export function getJerusalemParts(date: Date = new Date()): JerusalemParts {
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
  const p: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      p[part.type] = parseInt(part.value, 10);
    }
  }

  return {
    year: p.year ?? date.getFullYear(),
    month: (p.month ?? (date.getMonth() + 1)) - 1, // 0-indexed
    day: p.day ?? date.getDate(),
    hour: p.hour === 24 ? 0 : (p.hour ?? date.getHours()),
    minute: p.minute ?? date.getMinutes(),
    second: p.second ?? date.getSeconds(),
  };
}

/**
 * Creates a UTC Date representing a specific hour on a specific day in Asia/Jerusalem
 */
export function makeJerusalemDate(year: number, month: number, day: number, hour: number, minute: number = 0): Date {
  // Construct an approximate UTC noon date on that day
  const d = new Date(Date.UTC(year, month, day, 12, 0, 0));
  
  // Find the exact Jerusalem offset at noon on that calendar day (handles daylight saving accurately)
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    hour12: false,
  });
  const jerusalemHourAt12Utc = parseInt(formatter.format(d), 10);
  const offsetHours = jerusalemHourAt12Utc - 12; // +2 in winter (IST), +3 in summer (IDT)

  // Target hour in Jerusalem corresponds to (hour - offsetHours) in UTC
  return new Date(Date.UTC(year, month, day, hour - offsetHours, minute, 0));
}

/**
 * Returns the most recent scheduled check (07:00 or 17:00 Israel Time)
 */
export function getLastScheduledCheck(now: Date = new Date()): Date {
  const j = getJerusalemParts(now);

  let lastHour: number;
  let lastDayOffset: number;

  if (j.hour < 7) {
    // Before 07:00: last check was yesterday at 17:00
    lastHour = 17;
    lastDayOffset = -1;
  } else if (j.hour < 17) {
    // Between 07:00 and 17:00: last check was today at 07:00
    lastHour = 7;
    lastDayOffset = 0;
  } else {
    // Past 17:00: last check was today at 17:00
    lastHour = 17;
    lastDayOffset = 0;
  }

  return makeJerusalemDate(j.year, j.month, j.day + lastDayOffset, lastHour);
}

/**
 * Returns the upcoming scheduled check (07:00 or 17:00 Israel Time)
 */
export function getNextScheduledCheck(now: Date = new Date()): Date {
  const j = getJerusalemParts(now);

  let nextHour: number;
  let nextDayOffset: number;

  if (j.hour < 7) {
    // Before 07:00: next check is today at 07:00
    nextHour = 7;
    nextDayOffset = 0;
  } else if (j.hour < 17) {
    // Between 07:00 and 17:00: next check is today at 17:00
    nextHour = 17;
    nextDayOffset = 0;
  } else {
    // Past 17:00: next check is tomorrow at 07:00
    nextHour = 7;
    nextDayOffset = 1;
  }

  return makeJerusalemDate(j.year, j.month, j.day + nextDayOffset, nextHour);
}

/**
 * Formats a Date into a human-friendly string relative to today in Israel
 * e.g. "היום ב-07:00", "היום ב-17:00", "מחר ב-07:00", "אתמול ב-17:00"
 */
export function formatFriendlySchedule(targetDate: Date, now: Date = new Date()): {
  hebrew: string;
  english: string;
} {
  const nowParts = getJerusalemParts(now);
  const targetParts = getJerusalemParts(targetDate);

  const hourStr = String(targetParts.hour).padStart(2, '0') + ':00';

  // Compare calendar days in Jerusalem
  const nowDayEpoch = Date.UTC(nowParts.year, nowParts.month, nowParts.day);
  const targetDayEpoch = Date.UTC(targetParts.year, targetParts.month, targetParts.day);
  const diffDays = Math.round((targetDayEpoch - nowDayEpoch) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return {
      hebrew: `היום ב-${hourStr}`,
      english: `Today at ${hourStr}`,
    };
  } else if (diffDays === 1) {
    return {
      hebrew: `מחר ב-${hourStr}`,
      english: `Tomorrow at ${hourStr}`,
    };
  } else if (diffDays === -1) {
    return {
      hebrew: `אתמול ב-${hourStr}`,
      english: `Yesterday at ${hourStr}`,
    };
  }

  const dStr = `${String(targetParts.day).padStart(2, '0')}/${String(targetParts.month + 1).padStart(2, '0')}`;
  return {
    hebrew: `${dStr} ב-${hourStr}`,
    english: `${dStr} at ${hourStr}`,
  };
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
