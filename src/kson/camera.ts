import { type, type Type } from 'arktype';

import { ByPulse, ByPulseArkType, Double, GraphPoint, GraphPointArkType, GraphSectionPointArray, GraphSectionPointArrayArkType, Uint } from "./common.js";
import type { DefaultRaw } from "../util/type.js";

export type TiltInfoArkType = {
    scale: DefaultRaw<ByPulse<Double>[]>;
    manual?: ByPulseArkType<GraphSectionPointArrayArkType>[];
    keep: DefaultRaw<ByPulse<boolean>[]>;
}

export const TiltInfo: Type<TiltInfoArkType> = type({
    scale: ByPulse(Double).array().default((): ByPulse<Double>[] => [[0, 1.0]]),
    "manual?": ByPulse<GraphSectionPointArrayArkType>(GraphSectionPointArray).array(),
    keep: ByPulse(type('boolean')).array().default((): ByPulse<boolean>[] => [[0, false]]),
});
export type TiltInfo = typeof TiltInfo.infer;

export interface CamPatternInvokeSwingValueArkType {
    scale: DefaultRaw<Double, 1.0>;
    repeat: DefaultRaw<Uint, 1>;
    decay_order: DefaultRaw<Uint, 0>; // omit range check
}

export const CamPatternInvokeSwingValue: Type<CamPatternInvokeSwingValueArkType> = type({
    scale: Double.default(1.0),
    repeat: Uint.default(1),
    decay_order: Uint.default(0),
});
export type CamPatternInvokeSwingValue = typeof CamPatternInvokeSwingValue.infer;

const Direction: Type<-1|1> = type("-1|1");
type Direction = typeof Direction.infer;

export type CamPatternInvokeSpin = [y: Uint, direction: Direction, length: Uint];
export const CamPatternInvokeSpin: Type<CamPatternInvokeSpin> = type([
    Uint,
    Direction,
    Uint,
]);

export type CamPatternInvokeSwingArkType = [y: Uint, direction: Direction, length: Uint, v?: CamPatternInvokeSwingValueArkType];
export const CamPatternInvokeSwing: Type<CamPatternInvokeSwingArkType> = type([Uint, Direction, Uint, CamPatternInvokeSwingValue.optional()]);
export type CamPatternInvokeSwing = typeof CamPatternInvokeSwing.infer;

export interface CamPatternLaserInvokeListArkType {
    spin?: CamPatternInvokeSpin[];
    half_spin?: CamPatternInvokeSpin[];
    swing?: CamPatternInvokeSwingArkType[];
}

export const CamPatternLaserInvokeList: Type<CamPatternLaserInvokeListArkType> = type({
    "spin?": CamPatternInvokeSpin.array(),
    "half_spin?": CamPatternInvokeSpin.array(),
    "swing?": CamPatternInvokeSwing.array(),
});
export type CamPatternLaserInvokeList = typeof CamPatternLaserInvokeList.infer;

export interface CamPatternLaserInfoArkType {
    slam_event?: CamPatternLaserInvokeListArkType;
}
export const CamPatternLaserInfo: Type<CamPatternLaserInfoArkType> = type({
    "slam_event?": CamPatternLaserInvokeList,
});
export type CamPatternLaserInfo = typeof CamPatternLaserInfo.infer;

export interface CamPatternInfoArkType {
    laser?: CamPatternLaserInfoArkType;
}
export const CamPatternInfo: Type<CamPatternInfoArkType> = type({
    "laser?": CamPatternLaserInfo,
});
export type CamPatternInfo = typeof CamPatternInfo.infer;

export interface CamGraphsArkType {
    zoom?: GraphPointArkType[];
    shift_x?: GraphPointArkType[];
    rotation_x?: GraphPointArkType[];
    rotation_z?: GraphPointArkType[];
    center_split?: GraphPointArkType[];
}
export const CamGraphs: Type<CamGraphsArkType> = type({
    "zoom?": GraphPoint.array(),
    "shift_x?": GraphPoint.array(),
    "rotation_x?": GraphPoint.array(),
    "rotation_z?": GraphPoint.array(),
    "center_split?": GraphPoint.array(),
});
export type CamGraphs = typeof CamGraphs.infer;

export interface CamInfoArkType {
    body?: CamGraphsArkType;
    pattern?: CamPatternInfoArkType;
}
export const CamInfo: Type<CamInfoArkType> = type({
    "body?": CamGraphs,
    "pattern?": CamPatternInfo,
});
export type CamInfo = typeof CamInfo.infer;

export interface CameraInfoArkType {
    tilt?: TiltInfoArkType;
    cam?: CamInfoArkType;
}
export const CameraInfo: Type<CameraInfoArkType> = type({
    "tilt?": TiltInfo,
    "cam?": CamInfo,
});
export type CameraInfo = typeof CameraInfo.infer;