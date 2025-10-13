import { assert } from 'chai';
import { KSON_VERSION } from "./index.js";

describe("KSON_VERSION", function() {
    it("should be a string", function() {
        assert.isString(KSON_VERSION);
    });
});