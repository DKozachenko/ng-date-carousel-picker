import { IRangeItem } from '../models/interfaces';

/**
 * Форматирвоание даты
 * @param item элемент диапазна
 * @returns дата в формате "dd.mm.yyyy"
 */
export function formatDate(item: IRangeItem): string {
  const day: string = item.day.toString().padStart(2, '0');
  const month: string = (item.month + 1).toString().padStart(2, '0');
  const year: string = item.year.toString();

  return `${day}.${month}.${year}`;
}
