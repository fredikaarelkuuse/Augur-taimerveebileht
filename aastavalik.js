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
      const updateYearOptions = year => {
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
      updateYearOptions(currentYear);
      renderCalendar(currentYear);

      const updateCalendar = () => {
        if (!yearInput.reportValidity()) {
          return;
        }

        const year = Number(yearInput.value);
        renderCalendar(year);
        updateYearOptions(year);
      };

      yearInput.addEventListener('input', () => {
        if (yearInput.value !== '' && yearInput.validity.valid) {
          updateYearOptions(Number(yearInput.value));
        }
      });
      yearInput.addEventListener('change', updateCalendar);
      yearInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          updateCalendar();
        }
      });

      yearListToggle.addEventListener('click', () => {
        yearOptions.hidden = !yearOptions.hidden;
        yearListToggle.setAttribute('aria-expanded', String(!yearOptions.hidden));
        if (!yearOptions.hidden) {
          yearOptions.value = yearInput.value;
          yearOptions.focus();
        }
      });

      yearOptions.addEventListener('change', () => {
        yearInput.value = yearOptions.value;
        const year = Number(yearOptions.value);
        renderCalendar(year);
        updateYearOptions(year);
        yearOptions.hidden = true;
        yearListToggle.setAttribute('aria-expanded', 'false');
        yearListToggle.focus();
      });

      yearOptions.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          yearOptions.hidden = true;
          yearListToggle.setAttribute('aria-expanded', 'false');
          yearListToggle.focus();
        }
      });
    } else {
      renderCalendar(currentYear);
    }
  });
}
