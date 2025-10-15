import { type } from 'arktype';
import { exportType } from "../util/type.js";

import { Uint } from "./common.js";

export const GaugeInfo = exportType(type({
    total: Uint.default(0),
}));

export type GaugeInfo = typeof GaugeInfo.infer;