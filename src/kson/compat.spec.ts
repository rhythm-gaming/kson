import { assert } from 'chai';
import { KSHUnknownInfo, CompatInfo } from "./compat.js";

describe("KSHUnknownInfo", function() {
    it("should accept an empty object", function() {
        const data = {};
        assert.deepStrictEqual(KSHUnknownInfo.assert(data), data);
    });

    it("should accept valid data", function() {
        const data: KSHUnknownInfo = {
            meta: {
                "extvalue": "0"
            },
            option: {
                "extvalue": [
                    [0, "100"],
                    [480, "200"],
                    [960, "300"],
                    [1440, "400"]
                ],
                ";some-extension4": [
                    [960, "100"]
                ]
            },
            line: [
                [0, ";some-extension1"],
                [0, ";some-extension2"],
                [960, ";some-extension3"],
            ]
        };
        assert.deepStrictEqual(KSHUnknownInfo.assert(data), data);
    });

    it("should accept only 'meta'", function() {
        const data = { meta: { "a": "b" } };
        assert.deepStrictEqual(KSHUnknownInfo.assert(data), data);
    });

    it("should accept only 'option'", function() {
        const data: KSHUnknownInfo = { option: { "a": [[0, "b"]] } };
        assert.deepStrictEqual(KSHUnknownInfo.assert(data), data);
    });

    it("should accept only 'line'", function() {
        const data: KSHUnknownInfo = { line: [[0, "a"]] };
        assert.deepStrictEqual(KSHUnknownInfo.assert(data), data);
    });

    it("should reject invalid 'meta' values", function() {
        assert.throws(() => KSHUnknownInfo.assert({ meta: { "a": 1 } }));
        assert.throws(() => KSHUnknownInfo.assert({ meta: "not-an-object" }));
    });
    
    it("should reject invalid 'option' values", function() {
        assert.throws(() => KSHUnknownInfo.assert({ option: { "a": [[-1, "b"]] } }));
        assert.throws(() => KSHUnknownInfo.assert({ option: { "a": [[0, 1]] } }));
        assert.throws(() => KSHUnknownInfo.assert({ option: { "a": ["not-a-bypulse"] } }));
        assert.throws(() => KSHUnknownInfo.assert({ option: "not-an-object" }));
    });

    it("should reject invalid 'line' values", function() {
        assert.throws(() => KSHUnknownInfo.assert({ line: [[-1, "a"]] }));
        assert.throws(() => KSHUnknownInfo.assert({ line: [[0, 1]] }));
        assert.throws(() => KSHUnknownInfo.assert({ line: ["not-a-bypulse"] }));
        assert.throws(() => KSHUnknownInfo.assert({ line: "not-an-array" }));
    });
});

describe("CompatInfo", function() {
    it("should accept an empty object", function() {
        const data = {};
        assert.deepStrictEqual(CompatInfo.assert(data), data);
    });

    it("should accept valid data", function() {
        const data: CompatInfo = {
            ksh_version: "171",
            ksh_unknown: {
                line: [[0, ";comment"]]
            }
        };
        assert.deepStrictEqual(CompatInfo.assert(data), data);
    });

    it("should accept only 'ksh_version'", function() {
        const data = { ksh_version: "160" };
        assert.deepStrictEqual(CompatInfo.assert(data), data);
    });

    it("should accept only 'ksh_unknown'", function() {
        const data = { ksh_unknown: { meta: { "a": "b" } } };
        assert.deepStrictEqual(CompatInfo.assert(data), data);
    });

    it("should reject invalid 'ksh_version'", function() {
        assert.throws(() => CompatInfo.assert({ ksh_version: 171 }));
    });

    it("should reject invalid 'ksh_unknown'", function() {
        assert.throws(() => CompatInfo.assert({ ksh_unknown: { meta: { "a": 1 } } }));
        assert.throws(() => CompatInfo.assert({ ksh_unknown: "not-an-object" }));
    });
});
