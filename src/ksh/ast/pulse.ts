export type Pulse = number;

/** Values as specified in the KSH specification; not actually used in memory. */
export const FILE_PULSES_PER_WHOLE: Pulse = 192;

/** Multiplier for converting in-file pulses to in-memory pulses. */
export const PULSE_MULTIPLIER = 5;

/** Pulses per a whole note (4 quarter notes); m4saka recommends using 960 for reading KSH charts. */
export const PULSES_PER_WHOLE: Pulse = FILE_PULSES_PER_WHOLE * PULSE_MULTIPLIER;

/** Maximal length of a slant laser that would be considered as a slam */
export const SLAM_THRESHOLD: Pulse = PULSES_PER_WHOLE/32;

export function parsePulse(s: string, default_value?: null): Pulse|null;
export function parsePulse(s: string, default_value: Pulse): Pulse;
export function parsePulse(s: string, default_value: Pulse|null = null): Pulse|null {
    const t = parseInt(s, 10);
    if(!Number.isFinite(t)) return default_value;

    return t * PULSE_MULTIPLIER;
}

export function stringifyPulse(p: Pulse): string {
    return `${Math.round(p / PULSE_MULTIPLIER)}`;
}