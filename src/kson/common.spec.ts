import { assert } from 'chai';

import { Uint, Double, ByPulse } from "./common.js";

describe("Uint", function() {
    const ACCEPT_VALUES = [0, 42, 1000, 65535, 123456789];
    const REJECT_VALUES = [-10, -1];

    it("should accept valid int values", function() {
        for(const v of ACCEPT_VALUES) {
            assert.strictEqual(Uint.assert(v), v);
        }
    });
    it("should reject negative int values", function() {
        for(const v of REJECT_VALUES) {
            assert.throws(() => Uint.assert(v));
        }
    });
    it("should reject non-integer or non-finite values", function() {
        for(const v of [-0.01, 0.5, 42.1, 255.99, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NaN]) {
            assert.throws(() => Uint.assert(v));
        }
    });
    it("should reject non-number values", function() {
        for(const v of ["", "hello", {}, [], true, false, null, undefined]) {
            assert.throws(() => Uint.assert(v));
        }
    });
});

describe("Double", function() {
    it("should accept valid float values", function() {
        for(const v of [
            0,
            -0,
            42,
            -42.5,
            Number.MAX_SAFE_INTEGER,
            Number.MIN_SAFE_INTEGER,
            Number.MAX_VALUE,
            Number.MIN_VALUE,
        ]) {
            assert.strictEqual(Double.assert(v), v);
        }
    });

    it("should reject non-finite values", function() {
        for(const v of [
            Number.POSITIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
            Number.NaN
        ]) {
            assert.throws(() => Double.assert(v));
        }
    });
    
    it("should reject non-number values", function() {
        for(const v of ["", "hello", {}, [], true, false, null, undefined, 123n]) {
            assert.throws(() => Double.assert(v));
        }
    });
});

describe("ByPulse", function() {
    const ByPulseDouble = ByPulse(Double);

    it("should accept valid [Uint, Double] values", function() {
        for(const v of [
            [0, 0],
            [42, 123.45],
            [100, -98.76],
        ]) {
            assert.deepStrictEqual(ByPulseDouble.assert(v), v);
        }
    });

    it("should reject if pulse is not a Uint", function() {
        for(const v of [
            [-1, 0],
            [0.5, 0],
            [Number.POSITIVE_INFINITY, 0],
            [Number.NaN, 0],
            ["hello", 0],
        ]) {
            assert.throws(() => ByPulseDouble.assert(v));
        }
    });

    it("should reject if value is not the correct type", function() {
        for(const v of [
            [0, Number.POSITIVE_INFINITY],
            [0, Number.NEGATIVE_INFINITY],
            [0, Number.NaN],
            [0, "hello"],
        ]) {
            assert.throws(() => ByPulseDouble.assert(v));
        }
    });

    it("should reject if not a 2-element array", function() {
        for(const v of [
            [],
            [0],
            [0, 0, 0],
            {},
            "hello",
            123,
            null,
            undefined,
        ]) {
            assert.throws(() => ByPulseDouble.assert(v));
        }
    });
});