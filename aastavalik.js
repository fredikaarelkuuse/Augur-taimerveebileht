if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const yearInput = document.getElementById('calendar-year-input');
    const yearOptions = document.getElementById('calendar-year-options');
    const yearListToggle = document.getElementById('year-list-toggle');
    const currentYear = new Date().getFullYear();

    if (
      yearInput instanceof HTMLInputElement &&
      yearOptions instanceof HTMLSelectElement &&
      yearListToggle instanceof HTMLButtonElement
    ) {
      /* Koostab valitud aasta ümber 100-aastase mineviku ja tuleviku valikuloendi. */
      const uuendaAastaloendit = year => {
        const firstYear = Math.max(1000, year - 100);
        const lastYear = Math.min(9999, year + 100);
        yearOptions.replaceChildren();

        for (let optionYear = firstYear; optionYear <= lastYear; optionYear += 1) {
          const option = document.createElement('option');
          option.value = String(optionYear);
          option.textContent = String(optionYear);
          yearOptions.appendChild(option);
        }

        yearOptions.value = String(year);
      };

      yearInput.value = String(currentYear);
      uuendaAastaloendit(currentYear);
      kuvaKalender(currentYear);

      /* Uuendab kalendri, kui sisestatud aasta on lubatud vahemikus. */
      const uuendaKalendrit = () => {
        if (!yearInput.reportValidity()) {
          return;
        }

        const year = Number(yearInput.value);
        kuvaKalender(year);
        uuendaAastaloendit(year);
      };

      /* Nihutab soovitusloendit sisestuse ajal koos aasta väärtusega. */
      yearInput.addEventListener('input', () => {
        if (yearInput.value !== '' && yearInput.validity.valid) {
          uuendaAastaloendit(Number(yearInput.value));
        }
      });
      yearInput.addEventListener('change', uuendaKalendrit);
      yearInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          uuendaKalendrit();
        }
      });

      /* Avab loendi alati nähtava, keritava valikumenüüna. */
      yearListToggle.addEventListener('click', () => {
        const opening = yearOptions.hidden;
        yearOptions.hidden = !opening;
        yearListToggle.setAttribute('aria-expanded', String(!yearOptions.hidden));
        if (opening) {
          yearOptions.value = yearInput.value;
          yearOptions.focus();
        }
      });

      /* Rakendab loendist valitud aasta ja sulgeb loendi. */
      yearOptions.addEventListener('change', () => {
        yearInput.value = yearOptions.value;
        const year = Number(yearOptions.value);
        kuvaKalender(year);
        uuendaAastaloendit(year);
        yearOptions.hidden = true;
        yearListToggle.setAttribute('aria-expanded', 'false');
        yearListToggle.focus();
      });

      /* Sulgeb loendi, kui kasutaja vajutab sellest väljapoole. */
      document.addEventListener('click', event => {
        if (!event.target.closest('.year-picker') && !yearOptions.hidden) {
          yearOptions.hidden = true;
          yearListToggle.setAttribute('aria-expanded', 'false');
        }
      });

      /* Sulgeb loendi Escape-klahviga ja tagastab fookuse avamisnupule. */
      yearOptions.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          yearOptions.hidden = true;
          yearListToggle.setAttribute('aria-expanded', 'false');
          yearListToggle.focus();
        }
      });
    } else {
      kuvaKalender(currentYear);
    }
  });
}
