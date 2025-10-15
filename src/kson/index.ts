export const KSON_VERSION: `${number}.${number}.${number}` = "0.8.0";

export * from "./common.js";
export * from "./meta.js";
export * from "./beat.js";
export * from "./gauge.js";
export * from "./note.js";
export * from "./audio.js";
export * from "./camera.js";
export * from "./bg.js";
export * from "./editor.js";
export * from "./compat.js";
export * from "./impl.js";

import { type } from 'arktype';

import { exportType } from "../util/type.js";

import { MetaInfo } from "./meta.js";
import { BeatInfo } from "./beat.js";
import { GaugeInfo } from "./gauge.js";
import { NoteInfo } from "./note.js";
import { AudioInfo } from "./audio.js";
import { CameraInfo } from "./camera.js";
import { BGInfo } from "./bg.js";
import { EditorInfo } from "./editor.js";
import { CompatInfo } from "./compat.js";
import { ImplInfo } from "./impl.js";

export const Kson = exportType(type({
    version: "string",
    meta: MetaInfo,
    beat: BeatInfo,
    "gauge?": GaugeInfo,
    "note?": NoteInfo,
    "audio?": AudioInfo,
    "camera?": CameraInfo,
    "bg?": BGInfo,
    "editor?": EditorInfo,
    "compat?": CompatInfo,
    "impl?": ImplInfo,
}));
export type Kson = typeof Kson.infer;

/**
 * Parse KSON data from string or object.
 * @param data Either an object, or a stringified JSON object.
 * @returns Validated KSON object.
 */
export function parseKson(data: unknown): Kson {
    if(typeof data === 'string') data = JSON.parse(data);
    return Kson.assert(data);
}

/**
 * Simplify a given KSON object by removing all fields that are allowed to be omitted.
 * @param kson The KSON object to be simplified.
 * @returns 
 */
export function simplifyKson(kson: Kson): object {
    // TODO: Implement this!
    return kson;
}

/**
 * Serializes the given KSON object.
 * @param kson The KSON object to serialize.
 * @param simplify Whether to simplify the KSON object before serializing.
 * @returns 
 */
export function stringifyKson(kson: Kson, simplify: boolean = true): string {
    const obj: object = simplify ? simplifyKson(kson) : kson;
    return JSON.stringify(obj);
}