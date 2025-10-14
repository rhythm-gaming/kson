import type { Type, Out } from 'arktype';
import { type } from 'arktype';

declare const defaultsToKey: " defaultsTo";
export interface DefaultRaw<T=unknown, U=T> {
    [defaultsToKey]: [T, U];
}

export type ArrayArkType<T extends Type> = (In: Array<T['inferIn']>) => Out<Array<T['infer']>>;
export type PipeArkType<T extends Type, U> = (In: T['inferIn']) => Out<U>;

export function ConsType<Tt, Ut, $>(T: Type<Tt, $>, U: Type<Ut, $>): Type<[Tt, Ut], $> {
    return type([T, U]) as never;
}
