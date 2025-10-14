import { type, type Type } from 'arktype';

import { Int } from './common.js';
import type { DefaultRaw } from '../util/type.js';

export interface KSHBGInfo {
    filename?: string;
}

export const KSHBGInfo: Type<KSHBGInfo> = type({
    "filename?": 'string',
});

export interface KSHLayerRotationInfoArkType {
    tilt: DefaultRaw<boolean, true>;
    spin: DefaultRaw<boolean, true>;
}

export const KSHLayerRotationInfo: Type<KSHLayerRotationInfoArkType> = type({
    tilt: type('boolean').default(true),
    spin: type('boolean').default(true),
});
export type KSHLayerRotationInfo = typeof KSHLayerRotationInfo.infer;

export interface KSHLayerInfoArkType {
    filename?: string;
    duration: DefaultRaw<Int, 0>;
    rotation?: KSHLayerRotationInfoArkType;
}

export const KSHLayerInfo: Type<KSHLayerInfoArkType> = type({
    "filename?": 'string',
    duration: Int.default(0),
    "rotation?": KSHLayerRotationInfo,
});
export type KSHLayerInfo = typeof KSHLayerInfo.infer;

export interface KSHMovieInfoArkType {
    "filename?"?: 'string';
    offset: DefaultRaw<Int, 0>;
}

export const KSHMovieInfo: Type<KSHMovieInfoArkType> = type({
    "filename?": 'string',
    offset: Int.default(0),
});
export type KSHMovieInfo = typeof KSHMovieInfo.infer;

export interface LegacyBGInfoArkType {
    bg?: KSHBGInfo[];
    layer?: KSHLayerInfoArkType;
    movie?: KSHMovieInfoArkType;
}

export const LegacyBGInfo: Type<LegacyBGInfoArkType> = type({
    "bg?": KSHBGInfo.array().atLeastLength(1).atMostLength(2),
    "layer?": KSHLayerInfo,
    "movie?": KSHMovieInfo,
});
export type LegacyBGInfo = typeof LegacyBGInfo.infer;

export interface BGInfoArkType {
    filename?: string;
    offset: DefaultRaw<Int, 0>;
    legacy?: LegacyBGInfoArkType;
}

export const BGInfo: Type<BGInfoArkType> = type({
    "filename?": 'string',
    offset: Int.default(0),
    "legacy?": LegacyBGInfo,
});
export type BGInfo = typeof BGInfo.infer;