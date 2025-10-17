import { assert } from 'chai';
import { readTestData } from "../../util/test.js";

import { parseKSH } from "./parser.js";

describe("ksh/ast/parser", function() {
    describe("parseKSH", function() {
        it("should correctly parse `testcase/01-nov.ksh`", async function() {
            const data = await readTestData('chart/testcase/01-nov.ksh');
            const {header, body, footer} = parseKSH(data);
            
            // header: correct option list
            assert.deepStrictEqual(header, [
                { type: 'option', key: 'title', value: "Testcase 01 [NOV]" },
                { type: 'option', key: 'artist', value: '' },
                { type: 'option', key: 'effect', value: '' },
                { type: 'option', key: 'jacket', value: '.jpg' },
                { type: 'option', key: 'illustrator', value: '' },
                { type: 'option', key: 'difficulty', value: 'light' },
                { type: 'option', key: 'level', value: '1' },
                { type: 'option', key: 't', value: '120' },
                { type: 'option', key: 'm', value: '.mp3' },
                { type: 'option', key: 'mvol', value: '75' },
                { type: 'option', key: 'o', value: '0' },
                { type: 'option', key: 'bg', value: 'desert' },
                { type: 'option', key: 'layer', value: 'arrow' },
                { type: 'option', key: 'po', value: '0' },
                { type: 'option', key: 'plength', value: '15000' },
                { type: 'option', key: 'pfiltergain', value: '50' },
                { type: 'option', key: 'filtertype', value: 'peak' },
                { type: 'option', key: 'chokkakuautovol', value: '0' },
                { type: 'option', key: 'chokkakuvol', value: '50' },
                { type: 'option', key: 'ver', value: '171' },
            ]);

            // body: two lines
            assert.deepStrictEqual(body, [{
                line_no: 20,
                lines: [
                    {type: 'option', key: 'beat', value: '4/4'},
                    {type: 'chart', bt: '0000', fx: '00', laser: '--'},
                ],
            }]);

            // footer: empty
            assert.isEmpty(footer);
        });
    });
});