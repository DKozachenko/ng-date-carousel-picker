import { InjectionToken, LOCALE_ID, inject } from '@angular/core';

export const DCP_DATE_LOCALE = new InjectionToken<string>('DCP_DATE_LOCALE', {
  providedIn: 'root',
  factory: DCP_DATE_LOCALE_FACTORY,
});

export function DCP_DATE_LOCALE_FACTORY(): string {
  return inject(LOCALE_ID);
}
