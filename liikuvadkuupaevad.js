/**
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

// Kasutamise näide:
const aasta = 2026;
const puhad = getEstonianMovingHolidays(aasta);

console.log(`${aasta.toString()}. aasta liikuvad pühad:`);
console.table(puhad);

// Mooduli eksport Node.js keskkonnas
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getEasterDate, getEstonianMovingHolidays };
}
