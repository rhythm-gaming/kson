import { type } from 'arktype';
import { exportType } from "../../util/type.js";

import { ByPulse } from "./common.js";

export const KSHUnknownInfo = exportType(type({
    'meta?': {
        '[string]': 'string',
    },
    'option?': {
        '[string]': ByPulse(type('string')).array(),
    },
    'line?': ByPulse(type('string')).array(),
}));
export type KSHUnknownInfo = typeof KSHUnknownInfo.infer;

export const CompatInfo = exportType(type({
    'ksh_version?': 'string',
    'ksh_unknown?': KSHUnknownInfo,
}));
export type CompatInfo = typeof CompatInfo.infer;

