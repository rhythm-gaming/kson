export const KSON_VERSION: `${number}.${number}.${number}` = "0.8.0";

export * from "./meta";
export * from "./impl";

import { type, type Type } from 'arktype';

import { MetaInfo } from "./meta";
import { ImplInfo } from "./impl";

export interface KsonArkType {
    version: string;
    meta: MetaInfo;
    impl?: ImplInfo;
}

export const Kson: Type<KsonArkType> = type({
    version: "string",
    meta: MetaInfo,
    impl: ImplInfo.optional(),
});

export type Kson = typeof Kson.infer;

export function parseKson(data: unknown): Kson {
    if(typeof data === 'string') data = JSON.parse(data);
    return Kson.assert(data);
}