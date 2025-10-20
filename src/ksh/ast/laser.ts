export type LaserInd = number;
export const LASER_CONTINUE = -1;

export const LASER_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmno";
export const LASER_POS_MAX = LASER_CHARS.length - 1;

export const LASER_IND_MAP = Object.freeze(Object.fromEntries(
    Array.from(LASER_CHARS).map((c, i) => [c, i]) 
));

export function parseLaserChar(ch: string): LaserInd|null {
    if(ch === ':') return LASER_CONTINUE;
    else return LASER_IND_MAP[ch] ?? null;
}

export function stringifyLaserChar(laser: LaserInd|null): string {
    if (laser === null) return '-';
    if (laser === LASER_CONTINUE) return ':';
    return LASER_CHARS[laser] ?? '-';
}

export function parseLaser(laser: string): {laser: [LaserInd|null, LaserInd|null]} {
    return {
        laser: [
            parseLaserChar(laser[0]),
            parseLaserChar(laser[1]),
        ]
    };
}

export function stringifyLaser(laser: readonly [LaserInd|null, LaserInd|null]): string {
    return stringifyLaserChar(laser[0]) + stringifyLaserChar(laser[1]);
}