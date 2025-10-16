import { assert } from 'chai';
import { ImplInfo } from "./impl.js";

describe("ImplInfo", function() {
    it("should accept a valid record", function() {
        const data: ImplInfo = {
            "my_client": {
                "version": "1.0.0",
                "data": [1, 2, 3]
            }
        };
        assert.deepStrictEqual(ImplInfo.assert(data), data);
    });

    it("should accept an empty object", function() {
        const data = {};
        assert.deepStrictEqual(ImplInfo.assert(data), data);
    });

    it("should reject an array", function() {
        assert.throws(() => ImplInfo.assert([]));
        assert.throws(() => ImplInfo.assert([{"a": "b"}]));
    });

    it("should reject primitive values", function() {
        assert.throws(() => ImplInfo.assert("string"));
        assert.throws(() => ImplInfo.assert(123));
        assert.throws(() => ImplInfo.assert(true));
        assert.throws(() => ImplInfo.assert(null));
    });
});
