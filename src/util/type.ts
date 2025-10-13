import type { Type, Out } from 'arktype';

declare const defaultsToKey: " defaultsTo";
export interface DefaultRaw<T=unknown, U=unknown> {
    [defaultsToKey]: [T, U];
}

export type ArrayArkType<T extends Type> = (In: Array<T['inferIn']>) => Out<Array<T['infer']>>;
export type DefaultArkType<T extends Type, U extends T['infer']> = (In: DefaultRaw<T['inferIn'], U>) => Out<T['infer']>;
export type PipeArkType<T extends Type, U> = (In: T['inferIn']) => Out<U>;