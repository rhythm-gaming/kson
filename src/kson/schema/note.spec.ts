import { assert } from 'chai';

import { ButtonNote, LaserSection, NoteInfo } from "./note.js";

describe("kson/schema/note", function() {
    describe("ButtonNote", function() {
        it("should accept valid [Uint, Uint] values", function() {
            const ACCEPT_VALUES = [
                [0, 0], // chip note
                [100, 50], // long note
                [960, 240],
            ];
            for(const v of ACCEPT_VALUES) {
                assert.deepStrictEqual(ButtonNote.assert(v), v);
            }
        });

        it("should reject if y is not a Uint", function() {
            assert.throws(() => ButtonNote.assert([-1, 0]));
            assert.throws(() => ButtonNote.assert([0.5, 0]));
            assert.throws(() => ButtonNote.assert(["0", 0]));
        });

        it("should reject if l is not a Uint", function() {
            assert.throws(() => ButtonNote.assert([0, -1]));
            assert.throws(() => ButtonNote.assert([0, 0.5]));
            assert.throws(() => ButtonNote.assert([0, "0"]));
        });

        it("should reject if not a 2-element array", function() {
            assert.throws(() => ButtonNote.assert([]));
            assert.throws(() => ButtonNote.assert([0]));
            assert.throws(() => ButtonNote.assert([0, 0, 0]));
        });

        it("should reject non-array values", function() {
            assert.throws(() => ButtonNote.assert({}));
            assert.throws(() => ButtonNote.assert("hello"));
            assert.throws(() => ButtonNote.assert(123));
        });
    });

    describe("LaserSection", function() {
        it("should accept valid 2-element LaserSection values", function() {
            const value = [0, [[0, 0.0], [120, 1.0]]];
            const expected: LaserSection = [0, [[0, [0.0, 0.0]], [120, [1.0, 1.0]]]];
            assert.deepStrictEqual(LaserSection.assert(value), expected);
        });

        it("should accept valid 3-element LaserSection values", function() {
            const value = [0, [[0, 0.0], [120, 1.0]], 2];
            const expected: LaserSection = [0, [[0, [0.0, 0.0]], [120, [1.0, 1.0]]], 2];
            assert.deepStrictEqual(LaserSection.assert(value), expected);
        });

        it("should reject if y is not a Uint", function() {
            assert.throws(() => LaserSection.assert([-1, []]));
            assert.throws(() => LaserSection.assert([0.5, []]));
            assert.throws(() => LaserSection.assert(["0", []]));
        });
        
        it("should reject if v is not a valid GraphSectionPointArray", function() {
            assert.throws(() => LaserSection.assert([0, "hello"]));
            assert.throws(() => LaserSection.assert([0, {}]));
            assert.throws(() => LaserSection.assert([0, [[0, "a"]]]));
            assert.throws(() => LaserSection.assert([0, [[-1, 0.5]]]));
        });
        
        it("should reject if w is not a Uint", function() {
            assert.throws(() => LaserSection.assert([0, [], -1]));
            assert.throws(() => LaserSection.assert([0, [], 0.5]));
            assert.throws(() => LaserSection.assert([0, [], "1"]));
        });
        
        it("should reject if not a 2 or 3-element array", function() {
            assert.throws(() => LaserSection.assert([]));
            assert.throws(() => LaserSection.assert([0]));
            assert.throws(() => LaserSection.assert([0, [], 1, 2]));
        });
        
        it("should reject non-array values", function() {
            assert.throws(() => LaserSection.assert({}));
            assert.throws(() => LaserSection.assert("hello"));
        });
    });

    describe("NoteInfo", function() {
        const EMPTY_NOTES: NoteInfo = {
            bt: [[], [], [], []],
            fx: [[], []],
            laser: [[], []],
        };

        it("should accept an empty object", function() {
            assert.deepStrictEqual(NoteInfo.assert({}), EMPTY_NOTES);
        });

        it("should accept valid bt, fx, laser fields", function() {
            const value = {
                bt: [
                    [0, [1, 2]],
                    [100],
                    [],
                    [200, 300, [400, 50]],
                ],
                fx: [
                    [[0, 10]],
                    [100],
                ],
                laser: [
                    [
                        [0, [[0, 0.0], [120, 0.5]]],
                        [240, [[0, 1.0], [120, 0.5]], 2],
                    ],
                    [],
                ],
            };

            const expected: NoteInfo = {
                bt: [
                    [0, [1, 2]],
                    [100],
                    [],
                    [200, 300, [400, 50]],
                ],
                fx: [
                    [[0, 10]],
                    [100],
                ],
                laser: [
                    [
                        [0, [[0, [0.0, 0.0]], [120, [0.5, 0.5]]]],
                        [240, [[0, [1.0, 1.0]], [120, [0.5, 0.5]]], 2],
                    ],
                    [],
                ],
            };

            assert.deepStrictEqual(NoteInfo.assert(value), expected);
        });

        it("should accept only a bt field", function() {
            const value: Partial<NoteInfo> = {
                bt: [[], [], [], []],
            };
            assert.deepStrictEqual(NoteInfo.assert(value), EMPTY_NOTES);
        });
        
        it("should accept only an fx field", function() {
            const value: Partial<NoteInfo> = {
                fx: [[], []],
            };
            assert.deepStrictEqual(NoteInfo.assert(value), EMPTY_NOTES);
        });

        it("should accept only a laser field", function() {
            const value: Partial<NoteInfo> = {
                laser: [[], []],
            };
            assert.deepStrictEqual(NoteInfo.assert(value), EMPTY_NOTES);
        });

        it("should reject if bt has incorrect number of lanes", function() {
            assert.throws(() => NoteInfo.assert({ bt: [] }));
            assert.throws(() => NoteInfo.assert({ bt: [[], [], []] }));
            assert.throws(() => NoteInfo.assert({ bt: [[], [], [], [], []] }));
        });
        
        it("should reject if fx has incorrect number of lanes", function() {
            assert.throws(() => NoteInfo.assert({ fx: [] }));
            assert.throws(() => NoteInfo.assert({ fx: [[]] }));
            assert.throws(() => NoteInfo.assert({ fx: [[], [], []] }));
        });
        
        it("should reject if laser has incorrect number of lanes", function() {
            assert.throws(() => NoteInfo.assert({ laser: [] }));
            assert.throws(() => NoteInfo.assert({ laser: [[]] }));
            assert.throws(() => NoteInfo.assert({ laser: [[], [], []] }));
        });

        it("should reject if bt lane contains invalid notes", function() {
            assert.throws(() => NoteInfo.assert({ bt: [[-1], [], [], []] }));
            assert.throws(() => NoteInfo.assert({ bt: [[[-1, 0]], [], [], []] }));
            assert.throws(() => NoteInfo.assert({ bt: [["a"], [], [], []] }));
        });

        it("should reject if fx lane contains invalid notes", function() {
            assert.throws(() => NoteInfo.assert({ fx: [[-1], []] }));
            assert.throws(() => NoteInfo.assert({ fx: [[[-1, 0]], []] }));
            assert.throws(() => NoteInfo.assert({ fx: [["a"], []] }));
        });

        it("should reject if laser lane contains invalid sections", function() {
            assert.throws(() => NoteInfo.assert({ laser: [[[[-1, []]]], []] })); // invalid y in LaserSection
            assert.throws(() => NoteInfo.assert({ laser: [[[[0, "a"]]], []] })); // invalid v in LaserSection
        });
    });
});