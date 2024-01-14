import { Enumerate } from './enumerate.type';

/** Диапазон целых чисел */
export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
