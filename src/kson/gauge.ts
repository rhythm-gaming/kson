import { type, type Type } from 'arktype';

import { Uint } from "./common.js";
import type { DefaultRaw } from "../util/type.js";

export interface GaugeInfoArkType {
    total: DefaultRaw<Uint, 0>;
}

export const GaugeInfo: Type<GaugeInfoArkType> = type({
    total: Uint.default(0),
});
export type GaugeInfo = typeof GaugeInfo.infer;