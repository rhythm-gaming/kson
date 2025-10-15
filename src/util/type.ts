import type { Type, Out } from 'arktype';
import { type } from 'arktype';

declare const __public: unique symbol;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type PublicType<T, $ = {}> = Type<(In: unknown) => Out<T>, $> & {
    readonly [__public]: true;
};

export function exportType<T extends Type>(t: T) {
  return t as unknown as PublicType<T['inferOut']>;
}

export function ConsType<Tt, Ut, $>(T: Type<Tt, $>, U: Type<Ut, $>): Type<[Tt, Ut], $> {
    return type([T, U]) as never;
}
