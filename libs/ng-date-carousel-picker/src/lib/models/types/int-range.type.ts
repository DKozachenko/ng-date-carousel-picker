import { Enumerate } from './enumerate.type';

/** Integers type from F to T - 1 (inclusive) */
export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
