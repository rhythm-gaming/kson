import * as fs from "node:fs/promises";
import * as path from "node:path";

import { type Pulse, PULSES_PER_WHOLE } from "../ksh/ast/pulse.js";
import type { GraphSectionPointArray, LaserSection } from "../kson/index.js";

export async function readTestData(file_path: string) {
    return fs.readFile(new URL(path.join("..", "..", "test", file_path), import.meta.url), 'utf-8');
}

const PULSES_PER_BEAT = PULSES_PER_WHOLE / 4;

export function createLaserSection(points: Array<[beat_no: number, pos: number]>, width: number = 1): LaserSection {
    if(points.length === 0) return [0, []];

    const [start_beat] = points[0];
    const y: Pulse = start_beat * PULSES_PER_BEAT;

    const v: GraphSectionPointArray = [];
    for(const [beat_no, pos] of points) {
        const ry = (beat_no - start_beat) * PULSES_PER_BEAT;
        const last_v = v.at(-1);
        if(last_v?.[0] === ry) {
            last_v[1][1] = pos;
        } else {
            v.push([ry, [pos, pos]]);
        }
    }

    return width !== 1 ? [y, v, width] : [y, v];
}