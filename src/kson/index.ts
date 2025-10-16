export const KSON_VERSION: `${number}.${number}.${number}` = "0.8.0";

export * from "./schema/common.js";
export * from "./schema/meta.js";
export * from "./schema/beat.js";
export * from "./schema/gauge.js";
export * from "./schema/note.js";
export * from "./schema/audio.js";
export * from "./schema/camera.js";
export * from "./schema/bg.js";
export * from "./schema/editor.js";
export * from "./schema/compat.js";
export * from "./schema/impl.js";

import { type } from 'arktype';

import { exportType } from "../util/type.js";

import { MetaInfo } from "./schema/meta.js";
import { BeatInfo } from "./schema/beat.js";
import { GaugeInfo } from "./schema/gauge.js";
import { NoteInfo } from "./schema/note.js";
import { AudioInfo } from "./schema/audio.js";
import { CameraInfo } from "./schema/camera.js";
import { BGInfo } from "./schema/bg.js";
import { EditorInfo } from "./schema/editor.js";
import { CompatInfo } from "./schema/compat.js";
import { ImplInfo } from "./schema/impl.js";

export const KSON = exportType(type({
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
export type KSON = typeof KSON.infer;

/**
 * Parse KSON data from string or object.
 * @param data Either an object, or a stringified JSON object.
 * @returns Validated KSON object.
 */
export function parseKSON(data: unknown): KSON {
    if(typeof data === 'string') data = JSON.parse(data);
    return KSON.assert(data);
}

/**
 * Simplify a given KSON object by removing all fields that are allowed to be omitted.
 * @param kson The KSON object to be simplified.
 * @returns 
 */
export function simplifyKSON(kson: KSON): object {
    // TODO: Implement this!
    return kson;
}

/**
 * Serializes the given KSON object.
 * @param kson The KSON object to serialize.
 * @param simplify Whether to simplify the KSON object before serializing.
 * @returns 
 */
export function stringifyKSON(kson: KSON, simplify: boolean = true): string {
    const obj: object = simplify ? simplifyKSON(kson) : kson;
    return JSON.stringify(obj);
}