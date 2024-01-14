import { IRange } from '../models/interfaces';

export function isRange(obj: object): obj is IRange {
  /* eslint-disable-next-line no-prototype-builtins */
  return Object.keys(obj).length === 2 && obj.hasOwnProperty('start') && obj.hasOwnProperty('end');
}
