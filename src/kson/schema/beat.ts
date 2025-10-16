import { type } from 'arktype';
import { exportType } from "../../util/type.js";
import { ByMeasureIdx, ByPulse, Double, Uint, GraphPoint } from "./common.js";

const PositiveInt = Uint.narrow((v, ctx) => v > 0 || ctx.mustBe("a positive integer"));
export const TimeSig = exportType(type([PositiveInt, PositiveInt]));
export type TimeSig = typeof TimeSig.infer;

export const BeatInfo = exportType(type({
    bpm: ByPulse(Double).array(),
    time_sig: ByMeasureIdx(TimeSig).array().default(() => [[0, [4, 4]]]),
    scroll_speed: GraphPoint.array().default((): GraphPoint[] => [[0, [1.0, 1.0]]]),
}));
export type BeatInfo = typeof BeatInfo.infer;