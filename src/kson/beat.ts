import { type, type Type } from 'arktype';

import { ByMeasureIdx, ByPulse, Double, Uint, GraphPoint, GraphPointArkType } from "./common.js";
import type { DefaultRaw } from "../util/type.js";

export type TimeSig = [numerator: Uint, denominator: Uint];

const PositiveInt = Uint.narrow((v, ctx) => v > 0 || ctx.mustBe("a positive integer"));
export const TimeSig: Type<TimeSig> = type([PositiveInt, PositiveInt]);

export type BeatInfoArkType = {
    bpm: ByPulse<Double>[];
    time_sig: DefaultRaw<ByMeasureIdx<TimeSig>[]>;
    scroll_speed: DefaultRaw<GraphPointArkType[], GraphPoint[]>;
}

export const BeatInfo: Type<BeatInfoArkType> = type({
    bpm: ByPulse(Double).array(),
    time_sig: ByMeasureIdx(TimeSig).array().default(() => [[0, [4, 4]]]),
    scroll_speed: GraphPoint.array().default((): GraphPoint[] => [[0, [1.0, 1.0]]]),
});

export type BeatInfo = typeof BeatInfo.infer;