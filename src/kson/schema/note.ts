import { type } from 'arktype';
import { exportType } from "../../util/type.js";

import { GraphSectionPointArray, Uint } from "./common.js";

export const ButtonNote = exportType(type([
    Uint,
    Uint,
]));
export type ButtonNote = typeof ButtonNote.infer;

export const ButtonLane = exportType(type(Uint.or(ButtonNote)).array());
export type ButtonLane = typeof ButtonLane.infer;

export const LaserSection = exportType(type([
    Uint,
    GraphSectionPointArray,
    Uint.optional(),
]));
export type LaserSection = typeof LaserSection.infer;

export const LaserLane = exportType(LaserSection.array());
export type LaserLane = typeof LaserLane.infer;

export const NoteInfo = exportType(type({
    bt: type([ButtonLane, ButtonLane, ButtonLane, ButtonLane]).default(() => [[], [], [], []]),
    fx: type([ButtonLane, ButtonLane]).default(() => [[], []]),
    laser: type([LaserLane, LaserLane]).default(() => [[], []]),
}));
export type NoteInfo = typeof NoteInfo.infer;