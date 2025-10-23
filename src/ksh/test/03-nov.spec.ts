import { assert } from 'chai';

import { parseKSH, Pulse, PULSES_PER_WHOLE } from "../ast/index.js";
import { readTestData } from "../../util/test.js";

import { ksh2kson } from "../converter/index.js";
import { GraphSectionPointArray, KSON, LaserSection, createKSON } from "../../kson/index.js";

const PULSES_PER_BEAT = PULSES_PER_WHOLE / 4;

function createLaserSection(points: Array<[beat_no: number, pos: number]>): LaserSection {
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

    return [y, v];
}

describe("ksh/test/03-nov", function() {
    let kson: KSON = createKSON();

    before(async function() {
        const data = await readTestData('chart/testcase/03-nov.ksh');
        const ksh = parseKSH(data);

        kson = ksh2kson(ksh);
    });

    it("should set the metadata correctly", function() {
        assert.deepStrictEqual(kson.meta, {
            title: "Testcase 03 [NOV]",
            artist: "",
            chart_author: "",
            difficulty: 0,
            level: 3,
            disp_bpm: "120",
            jacket_filename: ".jpg",
            jacket_author: "",
        });
    });

    it("should set the beat info correctly", function() {
        assert.exists(kson.beat);
        assert.deepStrictEqual(kson.beat.bpm, [[0, 120]]);
        assert.deepStrictEqual(kson.beat.time_sig, [[0, [4, 4]]]);
        assert.deepStrictEqual(kson.beat.scroll_speed, [[0, [1.0, 1.0]]]);
    });

    it("should not fill-in BT and FX notes", function() {
        if(kson.note?.bt) {
            for(const bt of kson.note.bt) assert.isEmpty(bt);
        }

        if(kson.note?.fx) {
            for(const fx of kson.note.fx) assert.isEmpty(fx);
        }
    });

    it("should set laser notes correctly", function() {
        assert.exists(kson.note?.laser);
    })
});
