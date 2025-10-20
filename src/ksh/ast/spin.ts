import { stringifyPulse } from "./pulse.js";

export const SpinType = Object.freeze({
    NORMAL: 0,
    HALF:   1,
    SWING:  2,
} as const);

export type SpinType = typeof SpinType[keyof typeof SpinType];

/** left/right: -1/+1 */
export type SpinDir = -1 | 1;

export interface SpinInfo {
    type: SpinType;
    dir: SpinDir;
    duration: number;
}

export function parseSpinType(s: string): Omit<SpinInfo, 'duration'>|null {
    switch (s) {
        case '@(': return { type: SpinType.NORMAL, dir: -1 };
        case '@)': return { type: SpinType.NORMAL, dir: +1 };
        case '@<': return { type: SpinType.HALF,   dir: -1 };
        case '@>': return { type: SpinType.HALF,   dir: +1 };
        case 'S<': return { type: SpinType.SWING,  dir: -1 };
        case 'S>': return { type: SpinType.SWING,  dir: +1 };
        default: return null;
    }
}

export function stringifySpinInfoTypeDir(spin: Omit<SpinInfo, 'duration'>): string {
    switch (spin.type) {
        case SpinType.NORMAL:
            return spin.dir === -1 ? '@(' : '@)';
        case SpinType.HALF:
            return spin.dir === -1 ? '@<' : '@>';
        case SpinType.SWING:
            return spin.dir === -1 ? 'S<' : 'S>';
    }
}

export function stringifySpinInfo(spin: SpinInfo): string {
    return `${stringifySpinInfoTypeDir(spin)}${stringifyPulse(spin.duration)}`;
}