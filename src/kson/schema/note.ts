import { type } from 'arktype';
import { exportType } from "../../util/type.js";

import { GraphSectionPointArray, Uint } from "./common.js";

export const ButtonNote = exportType(type([
    Uint,
    Uint,
]));
export type ButtonNote = typeof ButtonNote.infer;

const ButtonLane = type(Uint.or(ButtonNote)).array();

export const LaserSection = exportType(type([
    Uint,
    GraphSectionPointArray,
    Uint.optional(),
]));
export type LaserSection = typeof LaserSection.infer;

const LaserLane = LaserSection.array();

export const NoteInfo = exportType(type({
    bt: type([ButtonLane, ButtonLane, ButtonLane, ButtonLane]).default(() => [[], [], [], []]),
    fx: type([ButtonLane, ButtonLane]).default(() => [[], []]),
    laser: type([LaserLane, LaserLane]).default(() => [[], []]),
}));
export type NoteInfo = typeof NoteInfo.infer;