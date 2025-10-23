import { assert } from 'chai';

import { parseKSH } from "../ast/index.js";
import { readTestData, createLaserSection } from "../../util/test.js";

import { ksh2kson } from "../converter/index.js";
import { KSON, createKSON } from "../../kson/index.js";

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
        assert.deepStrictEqual(kson.note.laser[0], [
            createLaserSection([
                [0, 0],
                [1, 0],
            ]),
            createLaserSection([
                [4, 0],
                [5, 1],
            ]),
            createLaserSection([
                [8, 0],
                [8.5, 1],
                [9, 0],
                [9.5, 0.5],
                [10, 0],
            ]),
            createLaserSection([
                [12, 0],
                [12, 1],
            ]),
            createLaserSection([
                [20, 0],
                [20, 1],
                [21, 0],
                [21, 1],
            ]),
        ]);
        assert.deepStrictEqual(kson.note.laser[1], [
            createLaserSection([
                [2, 1],
                [3, 1],
            ]),
            createLaserSection([
                [6, 1],
                [7, 0],
            ]),
            createLaserSection([
                [10, 1],
                [10.5, 0],
                [11, 1],
                [11.5, 0.5],
                [12, 1],
            ]),
            createLaserSection([
                [16, 1],
                [16, 0],
            ]),
            createLaserSection([
                [22, 1],
                [22, 0],
                [23, 1],
                [23, 0],
            ]),
        ]);
    })
});
