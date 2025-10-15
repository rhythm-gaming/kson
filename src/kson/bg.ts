import { type } from 'arktype';
import { exportType } from "../util/type.js";

import { Int } from "./common.js";

export const KSHBGInfo = exportType(type({
    "filename?": 'string',
}));
export type KSHBGInfo = typeof KSHBGInfo.infer;

export const KSHLayerRotationInfo = exportType(type({
    tilt: type('boolean').default(true),
    spin: type('boolean').default(true),
}));
export type KSHLayerRotationInfo = typeof KSHLayerRotationInfo.infer;

export const KSHLayerInfo = exportType(type({
    "filename?": 'string',
    duration: Int.default(0),
    "rotation?": KSHLayerRotationInfo,
}));
export type KSHLayerInfo = typeof KSHLayerInfo.infer;

export const KSHMovieInfo = exportType(type({
    "filename?": 'string',
    offset: Int.default(0),
}));
export type KSHMovieInfo = typeof KSHMovieInfo.infer;

export const LegacyBGInfo = exportType(type({
    "bg?": KSHBGInfo.array().atLeastLength(1).atMostLength(2),
    "layer?": KSHLayerInfo,
    "movie?": KSHMovieInfo,
}));
export type LegacyBGInfo = typeof LegacyBGInfo.infer;

export const BGInfo = exportType(type({
    "filename?": 'string',
    offset: Int.default(0),
    "legacy?": LegacyBGInfo,
}));
export type BGInfo = typeof BGInfo.infer;