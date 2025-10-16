import { assert } from 'chai';

import { TimeSig, BeatInfo } from "./beat.js";

describe("TimeSig", function() {
    it("should accept valid [PositiveInt, PositiveInt] values", function() {
        for(const v of [
            [1, 1],
            [4, 4],
            [3, 8],
            [7, 16],
            [16, 1],
        ]) {
            assert.deepStrictEqual(TimeSig.assert(v), v);
        }
    });

    it("should reject zero or negative integers", function() {
        for(const v of [
            [0, 4],
            [4, 0],
            [-1, 4],
            [4, -1],
        ]) {
            assert.throws(() => TimeSig.assert(v));
        }
    });

    it("should reject non-integers", function() {
        for(const v of [
            [1.5, 4],
            [4, 1.5],
        ]) {
            assert.throws(() => TimeSig.assert(v));
        }
    });

    it("should reject if not a 2-element array", function() {
        for(const v of [
            [],
            [4],
            [4, 4, 4],
        ]) {
            assert.throws(() => TimeSig.assert(v));
        }
    });

    it("should reject non-number values", function() {
        for(const v of [
            ["4", 4],
            [4, "4"],
            [null, 4],
            [4, undefined],
        ]) {
            assert.throws(() => TimeSig.assert(v));
        }
    });
});

describe("BeatInfo", function() {
    it("should accept a minimal valid BeatInfo object", function() {
        const input = {
            bpm: [[0, 120.0]],
        };
        const expected: BeatInfo = {
            bpm: [[0, 120.0]],
            time_sig: [[0, [4, 4]]],
            scroll_speed: [[0, [1.0, 1.0]]],
        };
        assert.deepStrictEqual(BeatInfo.assert(input), expected);
    });

    it("should accept a full valid BeatInfo object", function() {
        const input = {
            bpm: [[0, 120.0], [1920, 240.0]],
            time_sig: [[0, [4, 4]], [8, [3, 4]]],
            scroll_speed: [[0, 1.0], [960, 1.5, [0.5, 0.5]], [1920, [1.5, 0.5]]],
        };
        const expected: BeatInfo = {
            bpm: [[0, 120.0], [1920, 240.0]],
            time_sig: [[0, [4, 4]], [8, [3, 4]]],
            scroll_speed: [[0, [1.0, 1.0]], [960, [1.5, 1.5], [0.5, 0.5]], [1920, [1.5, 0.5]]],
        };
        assert.deepStrictEqual(BeatInfo.assert(input), expected);
    });
    
    it("should use default values for optional fields", function() {
        const input = {
            bpm: [[0, 180]],
        };
        const result = BeatInfo.assert(input);
        assert.deepStrictEqual(result, {
            bpm: [[0, 180]],
            time_sig: [[0, [4, 4]]],
            scroll_speed: [[0, [1.0, 1.0]]],
        });
    });

    it("should handle empty optional fields", function() {
        const input = {
            bpm: [[0, 180]],
            time_sig: [],
            scroll_speed: [],
        };
        const result = BeatInfo.assert(input);
        assert.deepStrictEqual(result, {
            bpm: [[0, 180]],
            time_sig: [],
            scroll_speed: [],
        });
    });
    
    it("should reject if bpm is missing", function() {
        assert.throws(() => BeatInfo.assert({}));
        assert.throws(() => BeatInfo.assert({
            time_sig: [[0, [4, 4]]],
            scroll_speed: [[0, 1.0]],
        }));
    });

    it("should reject if bpm is of the wrong type", function() {
        assert.throws(() => BeatInfo.assert({ bpm: "120" }));
        assert.throws(() => BeatInfo.assert({ bpm: [[0, "120"]] }));
    });

    it("should reject if time_sig contains invalid values", function() {
        assert.throws(() => BeatInfo.assert({
            bpm: [[0, 120]],
            time_sig: [[0, [4, 0]]],
        }));
        assert.throws(() => BeatInfo.assert({
            bpm: [[0, 120]],
            time_sig: [[-1, [4, 4]]],
        }));
    });

    it("should reject if scroll_speed contains invalid values", function() {
        assert.throws(() => BeatInfo.assert({
            bpm: [[0, 120]],
            scroll_speed: [[-1, 1.0]],
        }));
        assert.throws(() => BeatInfo.assert({
            bpm: [[0, 120]],
            scroll_speed: [[0, "1.0"]],
        }));
    });
});
