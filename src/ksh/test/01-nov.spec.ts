import { assert } from 'chai';
import { readTestData } from "../../util/test.js";

import { createKSH, HeaderContent, KSH, Measure } from '../ast/ast.js';

import { parseKSH } from "../ast/parser.js";
import { NoteType } from '../ast/note.js';
import { BeatOptionLine, parseOption } from '../ast/option.js';

import { createKSON, KSON, KSON_VERSION, MetaInfo } from "../../kson/index.js";
import { ksh2kson } from '../converter/index.js';

const EXPECTED_HEADERS: HeaderContent[] = [
    ['title', "Testcase 01 [NOV]"],
    ['artist', ''],
    ['effect', ''],
    ['jacket', '.jpg'],
    ['illustrator', ''],
    ['difficulty', 'light'],
    ['level', '1'],
    ['t', '120'],
    ['m', '.mp3'],
    ['mvol', '75'],
    ['o', '0'],
    ['bg', 'desert'],
    ['layer', 'arrow'],
    ['po', '0'],
    ['plength', '15000'],
    ['pfiltergain', '50'],
    ['filtertype', 'peak'],
    ['chokkakuautovol', '0'],
    ['chokkakuvol', '50'],
    ['ver', '171'],
].map(([k, v]) => parseOption(k, v));

const EXPECTED_META: MetaInfo = {
    title: "Testcase 01 [NOV]",
    artist: "",
    chart_author: "",
    difficulty: 0,
    level: 1,
    disp_bpm: "120",
    jacket_filename: ".jpg",
    jacket_author: "",
};

const EXPECTED_BODY: Measure[] = [{
    line_no: 20,
    lines: [
        {type: 'option', key: 'beat', raw: "4/4", time_sig: [4, 4]} satisfies BeatOptionLine,
        {
            type: 'chart',
            bt: [NoteType.NONE, NoteType.NONE, NoteType.NONE, NoteType.NONE],
            fx: [NoteType.NONE, NoteType.NONE],
            laser: [null, null],
        },
    ],
}];

describe("ksh/test/01-nov", function() {
    let ksh: KSH = createKSH();
    let kson: KSON = createKSON();

    before(async function() {
        const data = await readTestData("chart/testcase/01-nov.ksh");
        ksh = parseKSH(data);
        kson = ksh2kson(ksh);
    });

    it("should be correctly parsed", function() {
        const { header, body, footer } = ksh;

        assert.deepStrictEqual(header, EXPECTED_HEADERS);
        assert.deepStrictEqual(body, EXPECTED_BODY);
        assert.isEmpty(footer);
    });

    context("KSON conversion", function() {
        it("should set the version correctly", function() {
            assert.strictEqual(kson.version, KSON_VERSION);
        });

        it("should set the metadata correctly", function() {
            assert.deepStrictEqual(kson.meta, EXPECTED_META);
        });

        it("should set the beat info correctly", function() {
            assert.deepStrictEqual(kson.beat.bpm, [[0, 120]]);
            assert.deepStrictEqual(kson.beat.time_sig, [[0, [4, 4]]]);
            assert.deepStrictEqual(kson.beat.scroll_speed, [[0, [1.0, 1.0]]]);
        });

        it("should set the compat info correctly", function() {
            assert.exists(kson.compat);
            assert.strictEqual(kson.compat.ksh_version, '171');
            assert.notExists(kson.compat.ksh_unknown);
        });
        
        it("should omit non-specified info", function() {
            assert.exists(kson);
            assert.notExists(kson.gauge);
            assert.notExists(kson.camera);
            assert.notExists(kson.editor);
            assert.notExists(kson.impl);
        });
    });
});