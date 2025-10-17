import { assert } from 'chai';

import { parseKSH } from "../ast/index.js";
import { readTestData } from "../../util/test.js";

import { ksh2kson } from "./index.js";
import { KSON_VERSION } from "../../kson/index.js";

describe("ksh/ast/converter", function() {
    describe("ksh2kson", function() {
        it("should correctly convert `testcase/01-nov.ksh", async function() {
            const data = await readTestData('chart/testcase/01-nov.ksh');
            const ksh = parseKSH(data);

            const kson = ksh2kson(ksh);

            assert.strictEqual(kson.version, KSON_VERSION);
            
            assert.deepStrictEqual(kson.meta, {
                title: "Testcase 01 [NOV]",
                artist: "",
                chart_author: "",
                difficulty: 0,
                level: 1,
                disp_bpm: "120",
                jacket_filename: ".jpg",
                jacket_author: "",
            });

            assert.deepStrictEqual(kson.beat, {
                bpm: [[0, 120]],
                time_sig: [[0, [4, 4]]],
                scroll_speed: [],
            });
        });
    });
});