import { type, type Type } from 'arktype';

import { Double, Uint, type ByPulse, type ByMeasureIdx, GraphPoint } from "./common.js";

export type TimeSig = [numerator: Uint, denominator: Uint];
export const TimeSig: Type<TimeSig> = type([Uint, Uint]);

export interface BeatInfo {
    bpm: ByPulse<Double>[];
    time_sig: ByMeasureIdx<TimeSig>;
    scroll_speed: GraphPoint[];
}
