import { getTimezoneOffset } from 'date-fns-tz';

export default function useLocale(timeZone: string = 'America/Sao_Paulo'): Date {
  const now = new Date();
  const timeZoneOffset = getTimezoneOffset(timeZone, now);

  return new Date(now.getTime() + timeZoneOffset);
}
