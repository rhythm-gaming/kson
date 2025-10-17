/** Pulses per a whole note (4 quarter notes); m4saka recommends using 960 for reading KSH charts. */
export const PULSES_PER_WHOLE = 960;
export const FILE_PULSES_PER_WHOLE = 192;

/** Maximal length of a slant laser that would be considered as a slam */
export const SLAM_THRESHOLD = PULSES_PER_WHOLE/32;

export const LASER_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmno";
export const LASER_CHAR_DICT = new Map<string, number>(LASER_CHARS.split('').map((ch, ind) => [ch, ind]));
export const LASER_POS_MAX = LASER_CHARS.length-1;

export function normalizeDifficulty<T extends string>(difficulty: T): 0|1|2|3|T {
    switch(difficulty) {
        case 'light': return 0;
        case 'challenge': return 1;
        case 'extended': return 2;
        case 'infinite': return 3;
        default: return difficulty;
    }
}