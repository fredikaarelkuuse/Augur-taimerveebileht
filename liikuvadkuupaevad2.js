/* Arvutab etteantud aasta lihavõttepüha kuupäeva */
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
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(Date.UTC(year, month, day));
}

/* Liidab või lahutab kuupäevale etteantud arvu päevi */
function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/* Koostab nimekirja Eesti liikuvatest pühadest antud aastal */
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
      name: 'Vaikne Laupäev',
      description: 'Lihavõttepühade eelne vaikne päev, mil valmistuti pühade tähistamiseks.',
      date: addDays(easter, -1)
    },
    {
      name: 'Lihavõtted ehk munadepühad',
      description: 'Kevadine rõõmupüha, mis sümboliseerib elujõu taassündi. Kommeteks on munade värvimine, koksimine, kiikumine ja kevadiste toitude nautimine.',
      date: addDays(easter, 0)
    },
    {
      name: 'Ülestõusmispühade 2. püha',
      description: 'Lihavõttepühade teine päev, mil jätkatakse kevadise rõõmupüha tähistamist.',
      date: addDays(easter, 1)
    },
    {
      name: 'Taevaminemispühad',
      description: 'Kristlik püha, mida tähistatakse 40 päeva pärast lihavõtteid.',
      date: addDays(easter, 39)
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

/* Lisab liikuvate pühade kaardid õigete kuude alla */
function updateMovingHolidayDates(year) {
  const holidays = getEstonianMovingHolidays(year);
  const dateFormatter = new Intl.DateTimeFormat('et-EE', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC'
  });

  document.querySelectorAll('.püha-liikuv').forEach(card => card.remove());

  holidays.forEach(holiday => {
    const month = holiday.rawDate.getUTCMonth() + 1;
    const monthSection = document.querySelector(`details[data-month="${month}"]`);
    if (!monthSection) return;

    const cards = monthSection.querySelector('.kastid');
    if (!cards) return;

    const card = document.createElement('div');
    card.className = 'pühad püha-liikuv';

    const heading = document.createElement('h3');
    heading.textContent = `${holiday.name} – ${dateFormatter.format(holiday.rawDate)}`;

    const description = document.createElement('p');
    description.textContent = holiday.description;

    card.append(heading, description);
    cards.appendChild(card);
  });
}

/* Loeb URL-ist avalehelt saadetud püha nime ja kuvab selle lehe ülaosas */
function highlightHolidayFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const otsitavPyha = params.get('pyha');

  if (!otsitavPyha) return;

  const puhastatudNimi = otsitavPyha.trim().toLowerCase();
  const koikPyhad = document.querySelectorAll('.pühad');
  const ylemineKast = document.getElementById('esiletostetud-pyha');

  if (!ylemineKast) {
    console.warn('Puudub element id="esiletostetud-pyha"');
    return;
  }

  for (const kast of koikPyhad) {
    const pealkiri = kast.querySelector('h3');
    if (!pealkiri) continue;

    const pealkiriTekst = pealkiri.textContent.toLowerCase();
    const ainultNimi = pealkiriTekst.split(/[-–]/)[0].trim();

    if (pealkiriTekst.includes(puhastatudNimi) || puhastatudNimi.includes(ainultNimi)) {
      const koopia = kast.cloneNode(true);
      koopia.classList.add('esile-tostetud');

      ylemineKast.replaceChildren(koopia);
      ylemineKast.hidden = false;
      return;
    }
  }

  console.warn('Ei leidnud alamlehelt püha nimega:', otsitavPyha);
}

/* Käivitab skriptid pärast lehe laadimist */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('year-select');

    if (yearSelect) {
      const firstYear = 2026;
      const lastYear = 2099;
      yearSelect.replaceChildren();

      for (let year = firstYear; year <= lastYear; year += 1) {
        const option = document.createElement('option');
        option.value = String(year);
        option.textContent = String(year);
        yearSelect.appendChild(option);
      }

      yearSelect.value = String(firstYear);
      updateMovingHolidayDates(firstYear);
      highlightHolidayFromUrl();

      yearSelect.addEventListener('change', () => {
        updateMovingHolidayDates(Number(yearSelect.value));
      });
      return;
    }

    updateMovingHolidayDates(new Date().getFullYear());
    highlightHolidayFromUrl();
  });
}

/* Eksport teiste failide või testide jaoks */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getEasterDate, getEstonianMovingHolidays };
}