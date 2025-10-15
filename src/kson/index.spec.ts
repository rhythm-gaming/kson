import { assert } from 'chai';

import { parseKSON, stringifyKSON, KSON } from "./index.js";

const minimalKSON = {
    version: "0.8.0",
    meta: {
        title: "Test Title",
        artist: "Test Artist",
        chart_author: "Test Charter",
        difficulty: 1,
        level: 10,
        disp_bpm: "120-180",
    },
    beat: {
        bpm: [
            [0, 120.0]
        ],
    },
};

const defaultBeat = {
    bpm: [[0, 120.0]],
    scroll_speed: [[0, [1, 1]]],
    time_sig: [[0, [4, 4]]],
};

describe("kson", function() {
    describe("parseKSON", function() {
        it("should parse a valid KSON object", function() {
            const ksonObj = JSON.parse(JSON.stringify(minimalKSON));
            const result: unknown = parseKSON(ksonObj);
            assert.deepStrictEqual(result, {...minimalKSON, beat: defaultBeat});
        });

        it("should parse a valid KSON JSON string", function() {
            const jsonString = JSON.stringify(minimalKSON);
            const result: unknown = parseKSON(jsonString);
            assert.deepStrictEqual(result, {...minimalKSON, beat: defaultBeat});
        });

        it("should throw on an invalid KSON object (missing meta)", function() {
            const invalidKSON = JSON.parse(JSON.stringify(minimalKSON));
            delete invalidKSON.meta;
            assert.throws(() => parseKSON(invalidKSON));
        });

        it("should throw on an invalid KSON object (missing version)", function() {
            const invalidKSON = JSON.parse(JSON.stringify(minimalKSON));
            delete invalidKSON.version;
            assert.throws(() => parseKSON(invalidKSON));
        });

        it("should throw on an invalid KSON object (missing beat)", function() {
            const invalidKSON = JSON.parse(JSON.stringify(minimalKSON));
            delete invalidKSON.beat;
            assert.throws(() => parseKSON(invalidKSON));
        });

        it("should throw on an invalid KSON object (invalid pulse in beat.bpm)", function() {
            const invalidKSON = JSON.parse(JSON.stringify(minimalKSON));
            invalidKSON.beat.bpm = [[-1, 120]]; // Invalid pulse, must be Uint
            assert.throws(() => parseKSON(invalidKSON));
        });
    });

    describe("stringifyKSON", function() {
        it("should stringify a KSON object", function() {
            const kson = parseKSON(minimalKSON);

            const jsonString = stringifyKSON(kson);
            assert.isString(jsonString);
            
            const parsed = JSON.parse(jsonString);
            assert.deepStrictEqual(parsed, kson);
        });
    });
});
