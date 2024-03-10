import { Enumerate } from './enumerate.type';

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
