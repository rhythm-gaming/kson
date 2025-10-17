import { assert } from 'chai';

import { parseKSH } from "../ast/index.js";
import { readTestData } from "../../util/test.js";

import { ksh2kson } from "./index.js";
import { KSON, KSON_VERSION } from "../../kson/index.js";

describe("ksh/ast/converter", function() {
    describe("ksh2kson", function() {
        context("on `testcase/01-nov.ksh`", function() {
            let kson: KSON|null = null;

            before(async function() {
                const data = await readTestData('chart/testcase/01-nov.ksh');
                const ksh = parseKSH(data);

                kson = ksh2kson(ksh);
            });

            it("should set the version correctly", function() {
                assert.exists(kson);
                assert.strictEqual(kson.version, KSON_VERSION);
            });

            it("should set the metadata correctly", function() {
                assert.exists(kson);
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
            });

            it("should set the beat info correctly", function() {
                assert.exists(kson?.beat);
                assert.deepStrictEqual(kson.beat.bpm, [[0, 120]]);
                assert.deepStrictEqual(kson.beat.time_sig, [[0, [4, 4]]]);
                assert.deepStrictEqual(kson.beat.scroll_speed, [[0, [1.0, 1.0]]]);
            });

            it("should set the compat info correctly", function() {
                assert.exists(kson?.compat);
                assert.strictEqual(kson.compat.ksh_version, '171');
                // TODO: assert.notExists(kson.compat.ksh_unknown);
            });

            it("should omit non-specified info", function() {
                assert.exists(kson);
                assert.notExists(kson.gauge);
                // assert.notExists(kson.audio);
                assert.notExists(kson.camera);
                // assert.notExists(kson.bg);
                assert.notExists(kson.editor);
                // assert.notExists(kson.compat);
                assert.notExists(kson.impl);
            })
        });
    });
});