import { type, type Type } from 'arktype';

import { ByPulse } from './common.js';

export interface KSHUnknownInfo {
    meta?: Record<string, string>;
    option?: Record<string, ByPulse<string>[]>;
    line?: ByPulse<string>[];
}

export const KSHUnknownInfo: Type<KSHUnknownInfo> = type({
    'meta?': {
        '[string]': 'string',
    },
    'option?': {
        '[string]': ByPulse(type('string')).array(),
    },
    'line?': ByPulse(type('string')).array(),
});

export interface CompatInfo {
    ksh_version?: string;
    ksh_unknown?: KSHUnknownInfo;
}

export const CompatInfo: Type<CompatInfo> = type({
    'ksh_version?': 'string',
    'ksh_unknown?': KSHUnknownInfo,
});
