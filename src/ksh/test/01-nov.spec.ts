import { assert } from 'chai';
import { readTestData } from "../../util/test.js";

import { HeaderContent, KSH, Measure } from '../ast/ast.js';

import { parseKSH } from "../ast/parser.js";
import { NoteType } from '../ast/note.js';
import { BeatOptionLine, parseOption } from '../ast/option.js';

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
    let ksh: KSH = { header: [], body: [], footer: [] };

    before(async function() {
        const data = await readTestData("chart/testcase/01-nov.ksh");
        ksh = parseKSH(data);
    });

    it("should be correctly parsed", async function() {
        const { header, body, footer } = ksh;

        assert.deepStrictEqual(header, EXPECTED_HEADERS);
        assert.deepStrictEqual(body, EXPECTED_BODY);
        assert.isEmpty(footer);
    });

    it("should be correctly converted to KSON", async function() {});
});