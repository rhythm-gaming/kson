export const KSON_VERSION: `${number}.${number}.${number}` = "0.8.0";

export * from "./common.js";
export * from "./meta.js";
export * from "./beat.js";
export * from "./gauge.js";
// export * from "./note.js";
// export * from "./audio.js";
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
    "camera?": CameraInfo,
    "bg?": BGInfo,
    "editor?": EditorInfo,
    "compat?": CompatInfo,
    "impl?": ImplInfo,
}));
export type Kson = typeof Kson.infer;

export function parseKson(data: unknown): Kson {
    if(typeof data === 'string') data = JSON.parse(data);
    return Kson.assert(data);
}