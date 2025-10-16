import { assert } from 'chai';

import { parseKSH } from "./parser.js";
import { stringifyKSH } from "./stringify.js";

describe("ksh", () => {
    describe("ast", () => {
        describe("stringifyKSH", () => {
            it("should handle an empty file", () => {
                const ast = parseKSH("");
                const stringified = stringifyKSH(ast);
                assert.strictEqual(stringified, "");
            });

            it("should add a bar line for a header-only file", () => {
                const data = "title=test\nartist=me";
                const ast = parseKSH(data);
                const stringified = stringifyKSH(ast);
                assert.strictEqual(stringified, "title=test\nartist=me\n--");
            });

            it("should move definitions to the end", () => {
                const data = "title=test\n#define_fx MyFX type=Flanger\n--\nbeat=4/4\n0000|00|--\n--";
                const ast = parseKSH(data);
                const stringified = stringifyKSH(ast);
                const expected = "title=test\n--\nbeat=4/4\n0000|00|--\n--\n#define_fx MyFX type=Flanger";
                assert.strictEqual(stringified, expected);
            });
        });
    });
});