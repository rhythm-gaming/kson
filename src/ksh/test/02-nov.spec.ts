import { assert } from 'chai';

import { parseKSH, PULSES_PER_WHOLE } from "../ast/index.js";
import { readTestData } from "../../util/test.js";

import { ksh2kson } from "../converter/index.js";
import { KSON, KSON_VERSION, createKSON } from "../../kson/index.js";

describe("ksh/test/02-nov", function() {
    let kson: KSON = createKSON();

    before(async function() {
        const data = await readTestData('chart/testcase/02-nov.ksh');
        const ksh = parseKSH(data);

        kson = ksh2kson(ksh);
    });

    it("should set the version correctly", function() {
        assert.strictEqual(kson.version, KSON_VERSION);
    });

    it("should set the metadata correctly", function() {
        assert.deepStrictEqual(kson.meta, {
            title: "Testcase 02 [NOV]",
            artist: "02-NOV art HEXAGON",
            chart_author: "02-NOV effect HEXAGON",
            difficulty: 0,
            level: 2,
            disp_bpm: "120",
            jacket_filename: ".jpg",
            jacket_author: "02-NOV illust HEXAGON",
        });
    });

    it("should set the beat info correctly", function() {
        assert.exists(kson.beat);
        assert.deepStrictEqual(kson.beat.bpm, [[0, 120]]);
        assert.deepStrictEqual(kson.beat.time_sig, [[0, [4, 4]]]);
        assert.deepStrictEqual(kson.beat.scroll_speed, [[0, [1.0, 1.0]]]);
    });

    it("should set the note info correctly", function() {
        assert.exists(kson.note);
        const note = kson.note;

        assert.deepStrictEqual(note.bt[0], [
            0, 1, 2, 3, 4, 5, 6, 7,
            56, 57, 58, 59, 60, 61, 62, 63,
        ].map((t) => t * (PULSES_PER_WHOLE/4)));

        assert.strictEqual(note.bt[1].length, 16);
        assert.strictEqual(note.bt[2].length, 16);
        assert.strictEqual(note.bt[3].length, 16);

        assert.strictEqual(note.fx[0].length, 16);
        assert.strictEqual(note.fx[1].length, 16);

        assert.isEmpty(note.laser[0]);
        assert.isEmpty(note.laser[1]);
    });
});
