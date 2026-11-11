/**
 * Arvutab Gregooriuse kalendri lihavõttepüha (ülestõusmispüha) kuupäeva.
 * Kasutab Meeus/Jones/Butcheri algoritmi.
 * 
 * @param {number} year Aasta number (nt 2026)
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
 * @returns {Array<{ name: string, description: string, date: string, rawDate: Date }>}
 */
function getEstonianMovingHolidays(year) {
  const easter = getEasterDate(year);

  const holidays = [
    {
      name: 'Vastlapäev',
      description: 'Liikuv püha enne suure paastu algust. Kommeteks on linasõidu tagamiseks kelgutamine, vastlakuklite söömine ja hernesupi keetmine.',
      date: addDays(easter, -47)
    },
    {
      name: 'Tuhkapäev',
      description: 'Järgneb vahetult vastlapäevale ning tähistab 40-päevase paastuaja algust. Vanarahvas pühkis sel päeval ahjust tuhka ja viis seda põllule väetiseks.',
      date: addDays(easter, -46)
    },
    {
      name: 'Urbepäev ehk palmipuudepüha',
      description: 'Nädal enne lihavõtteid tähistatav püha. Kombeks oli varahommikul teisi pajuvitega ehk urbadega "urgitseda" või vitsutada, soovides tervist ja hääd õnne.',
      date: addDays(easter, -7)
    },
    {
      name: 'Suur Neljapäev',
      description: 'Vaikse nädala neljapäev, ettevalmistusaeg ja puhtuse loomise päev enne lihavõtteid.',
      date: addDays(easter, -3)
    },
    {
      name: 'Suur Reede',
      description: 'Vaikne ja tõsine kiriklik püha enne lihavõtteid. Sel päeval pidi valitsema rahu, mürarikkad tööd ja pidustused olid keelatud.',
      date: addDays(easter, -2)
    },
    {
      name: 'Lihavõtted ehk munadepühad',
      description: 'Kevadine rõõmupüha, mis sümboliseerib elujõu taassündi. Kommeteks on munade värvimine, koksimine, kiikumine ja kevadiste toitude nautimine.',
      date: addDays(easter, 0)
    },
    {
      name: 'Suvistepühad ehk nelipühad',
      description: 'Kevadine rõõmupüha looduse tärkamise tähistamiseks, mil tubasid ehiti kaskedega ning värviti mune.',
      date: addDays(easter, 49)
    }
  ];

  return holidays.map(h => ({
    name: h.name,
    description: h.description,
    date: h.date.toISOString().split('T')[0],
    rawDate: h.date
  }));
}

/**
 * Kuva liikuvad pühad HTML-is vastava kuu all.
 */
function displayEstonianMovingHolidays(year) {
  const holidays = getEstonianMovingHolidays(year);
  const dateFormatter = new Intl.DateTimeFormat('et-EE', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC'
  });

  holidays.forEach(holiday => {
    // Leiame kuu numbri (1 - 12)
    const monthNumber = holiday.rawDate.getUTCMonth() + 1;
    
    // Otsime HTML-ist details elemendi data-month atribuudi järgi
    const monthSection = document.querySelector(`details[data-month="${monthNumber}"]`);

    if (!monthSection) return;

    const kastid = monthSection.querySelector('.kastid');
    if (!kastid) return;

    // Loome uue püha div-elemendi
    const pyhaDiv = document.createElement('div');
    pyhaDiv.className = 'pühad';

    const formattedDate = dateFormatter.format(holiday.rawDate);

    pyhaDiv.innerHTML = `
      <h3>${holiday.name} - ${formattedDate} (liikuv püha)</h3>
      <p>${holiday.description}</p>
    `;

    // Lisame püha kaardi kuu sisse
    kastid.appendChild(pyhaDiv);
  });
}

// Käivitatakse siis, kui HTML leht on laetud
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    displayEstonianMovingHolidays(new Date().getFullYear());
  });
}

// Mooduli eksport Node.js keskkonnas (vajadusel)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getEasterDate, getEstonianMovingHolidays };
}