import { type } from 'arktype';
import { exportType } from "../../util/type.js";

import { ByPulse, Double, GraphPoint, GraphSectionPointArray, Uint } from "./common.js";

export const TiltInfo = exportType(type({
    scale: ByPulse(Double).array().default((): ByPulse<Double>[] => [[0, 1.0]]),
    "manual?": ByPulse(GraphSectionPointArray).array(),
    keep: ByPulse(type('boolean')).array().default((): ByPulse<boolean>[] => [[0, false]]),
}));
export type TiltInfo = typeof TiltInfo.infer;

export const CamPatternInvokeSwingValue = exportType(type({
    scale: Double.default(1.0),
    repeat: Uint.default(1),
    decay_order: Uint.default(0), // omit range check
}));
export type CamPatternInvokeSwingValue = typeof CamPatternInvokeSwingValue.infer;

const Direction = type("-1|1");
type Direction = typeof Direction.infer;

export const CamPatternInvokeSpin = exportType(type([
    Uint,
    Direction,
    Uint,
]));
export type CamPatternInvokeSpin = typeof CamPatternInvokeSpin.infer;

export const CamPatternInvokeSwing = exportType(type([Uint, Direction, Uint, CamPatternInvokeSwingValue.optional()]));
export type CamPatternInvokeSwing = typeof CamPatternInvokeSwing.infer;

export const CamPatternLaserInvokeList = exportType(type({
    "spin?": CamPatternInvokeSpin.array(),
    "half_spin?": CamPatternInvokeSpin.array(),
    "swing?": CamPatternInvokeSwing.array(),
}));
export type CamPatternLaserInvokeList = typeof CamPatternLaserInvokeList.infer;

export const CamPatternLaserInfo = exportType(type({
    "slam_event?": CamPatternLaserInvokeList,
}));
export type CamPatternLaserInfo = typeof CamPatternLaserInfo.infer;

export const CamPatternInfo = exportType(type({
    "laser?": CamPatternLaserInfo,
}));
export type CamPatternInfo = typeof CamPatternInfo.infer;

export const CamGraphs = exportType(type({
    "zoom?": GraphPoint.array(),
    "shift_x?": GraphPoint.array(),
    "rotation_x?": GraphPoint.array(),
    "rotation_z?": GraphPoint.array(),
    "center_split?": GraphPoint.array(),
}));
export type CamGraphs = typeof CamGraphs.infer;

export const CamInfo = exportType(type({
    "body?": CamGraphs,
    "pattern?": CamPatternInfo,
}));
export type CamInfo = typeof CamInfo.infer;

export const CameraInfo = exportType(type({
    "tilt?": TiltInfo,
    "cam?": CamInfo,
}));
export type CameraInfo = typeof CameraInfo.infer;