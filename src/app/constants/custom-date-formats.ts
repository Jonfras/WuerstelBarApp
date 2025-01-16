// custom-date-formats.ts
import { MatDateFormats } from '@angular/material/core';

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD.MM.YYYY', // Input parsing format
  },
  display: {
    dateInput: 'dd.MM.yyyy', // Displayed format in input
    monthYearLabel: 'MMM YYYY', // Format for month/year picker
    dateA11yLabel: 'LL', // Accessibility label
    monthYearA11yLabel: 'MMMM YYYY', // Accessibility label for month/year picker
  },
};
