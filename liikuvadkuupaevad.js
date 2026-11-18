/**
Kõik credit Geminile (vibecode final boss :D)
 * Arvutab gregooriuse kalendri lihavõttepüha (ülestõusmispüha) kuupäeva.
 * Kasutab Meeus/Jones/Butcheri algoritmi.
 * 
 * @param {number} year - Aasta number (nt 2026)
 * @returns {Date} Lihavõttepüha kuupäev (UTC)
 */
function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0 = jaanuar, 3 = aprill
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(Date.UTC(year, month, day));
}

/**
 * Abifunktsioon kuupäevale päevade lisamiseks või lahutamiseks.
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Leiab Eesti liikuvad pühad ja tähtpäevad antud aastal.
 * 
 * @param {number} year 
 * @returns {Array<{ name: string, date: string, isOfficialPublicHoliday: boolean }>}
 */
function getEstonianMovingHolidays(year) {
  const easter = getEasterDate(year);

  const holidays = [
    {
      name: 'Vastlapäev',
      date: addDays(easter, -47),
      isOfficialPublicHoliday: false
    },
    {
      name: 'Palmipuudepüha',
      date: addDays(easter, -7),
      isOfficialPublicHoliday: false
    },
    {
      name: 'Suur Neljapäev',
      date: addDays(easter, -3),
      isOfficialPublicHoliday: false
    },
    {
      name: 'Suur Reede',
      date: addDays(easter, -2),
      isOfficialPublicHoliday: true
    },
    {
      name: 'Vaikne Laupäev',
      date: addDays(easter, -1),
      isOfficialPublicHoliday: false
    },
    {
      name: 'Ülestõusmispühade 1. püha (Lihavõtted)',
      date: addDays(easter, 0),
      isOfficialPublicHoliday: true
    },
    {
      name: 'Ülestõusmispühade 2. püha',
      date: addDays(easter, 1),
      isOfficialPublicHoliday: false
    },
    {
      name: 'Taevaminemispüha',
      date: addDays(easter, 39),
      isOfficialPublicHoliday: false
    },
    {
      name: 'Nelipühade 1. püha',
      date: addDays(easter, 49),
      isOfficialPublicHoliday: true
    }
  ];

  return holidays.map(h => ({
    name: h.name,
    date: h.date.toISOString().split('T')[0],
    isOfficialPublicHoliday: h.isOfficialPublicHoliday
  }));
}

function displayEstonianMovingHolidays(year) {
  document.querySelectorAll('.moving-holidays').forEach(list => list.remove());

  const holidays = getEstonianMovingHolidays(year);
  const dateFormatter = new Intl.DateTimeFormat('et-EE', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC'
  });

  holidays.forEach(holiday => {
    const [holidayYear, month] = holiday.date.split('-');
    const monthSection = document.querySelector(
      `details[data-month="${Number(month)}"]`
    );

    if (!monthSection) {
      return;
    }

    let list = monthSection.querySelector('.moving-holidays');
    if (!list) {
      list = document.createElement('ul');
      list.className = 'moving-holidays';
      monthSection.appendChild(list);
    }

    const item = document.createElement('li');
    item.dataset.date = holiday.date;
    item.textContent = `${holiday.name} — ${dateFormatter.format(
      new Date(`${holiday.date}T00:00:00Z`)
    )}`;
    list.appendChild(item);
  });
}
/* Arvutab valitud aasta nädalapäevad ja lisab kirjele vaba päeva märke. */
function lisaNädalaPäevadJaVabapäevaMärge(year) {
  const monthNumbers = {
    jaanuar: 1,
    veebruar: 2,
    märts: 3,
    aprill: 4,
    mai: 5,
    juuni: 6,
    juuli: 7,
    august: 8,
    september: 9,
    oktoober: 10,
    november: 11,
    detsember: 12
  };
  const publicHolidayDates = new Set([
    `${year}-01-01`,
    `${year}-02-24`,
    `${year}-05-01`,
    `${year}-06-23`,
    `${year}-06-24`,
    `${year}-08-20`,
    `${year}-12-24`,
    `${year}-12-25`,
    `${year}-12-26`,
    ...getEstonianMovingHolidays(year)
      .filter(holiday => holiday.isOfficialPublicHoliday)
      .map(holiday => holiday.date)
  ]);
  const weekdayFormatter = new Intl.DateTimeFormat('et-EE', {
    weekday: 'long',
    timeZone: 'UTC'
  });
  const datePattern = /(\d{1,2})\.\s*(jaanuar|veebruar|märts|aprill|mai|juuni|juuli|august|september|oktoober|november|detsember)/gi;

  document.querySelectorAll('details[data-month] li').forEach(item => {
    const originalText = item.dataset.calendarText || item.textContent;
    item.dataset.calendarText = originalText;

    const dates = item.dataset.date
      ? [item.dataset.date]
      : [...originalText.matchAll(datePattern)].map(match => {
          const month = monthNumbers[match[2].toLocaleLowerCase('et-EE')];
          return `${year}-${String(month).padStart(2, '0')}-${String(match[1]).padStart(2, '0')}`;
        });

    if (dates.length === 0) {
      return;
    }

    const weekdayLabels = dates.map(date => {
      const [, month, day] = date.match(/^\d{4}-(\d{2})-(\d{2})$/);
      const label = weekdayFormatter.format(new Date(`${date}T00:00:00Z`));
      const dateLabel = `${Number(day)}. ${Object.keys(monthNumbers).find(
        name => monthNumbers[name] === Number(month)
      )}`;
      return dates.length > 1 ? `${dateLabel}: ${label}` : label;
    });
    const isPublicHoliday = dates.some(date => publicHolidayDates.has(date));
    const holidayName = document.createElement('span');
    holidayName.className = 'holiday-name';
    holidayName.textContent = originalText;

    const weekday = document.createElement('span');
    weekday.className = 'weekday';
    weekday.textContent = weekdayLabels.join('; ');

    const status = document.createElement('span');
    status.className = 'holiday-status';
    if (isPublicHoliday) {
      status.textContent = 'Riigipüha – vaba päev';
    }

    item.replaceChildren(holidayName, weekday, status);
  });

  const yearLabel = document.getElementById('calendar-year');
  if (yearLabel) {
    yearLabel.textContent = `(${year})`;
  }
}

/* Uuendab liikuvad pühad ja kogu kalendri aastaandmed. */
function kuvaKalender(year) {
  displayEstonianMovingHolidays(year);
  lisaNädalaPäevadJaVabapäevaMärge(year);
}

// Mooduli eksport Node.js keskkonnas
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getEasterDate, getEstonianMovingHolidays };
}
