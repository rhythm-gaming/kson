export const TICKS_PER_WHOLE_NOTE = 192;

export const LASER_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmno";

export function difficultyToInt(difficulty: string): 0|1|2|3 {
    switch(difficulty) {
        case 'light': return 0;
        case 'challenge': return 1;
        case 'extended': return 2;
        case 'infinite': return 3;
        default: return 3;
    }
}