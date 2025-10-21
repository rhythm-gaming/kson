import { assert } from 'chai';

import {
    parseOption,
    stringifyOption,
    isUnknownOption,
    type BeatOptionLine,
    type DifficultyOptionLine,
    type FXOptionLine,
    type FXSoundEffectOptionLine,
    type LayerOptionLine,
    type StopOptionLine,
    type UnknownOptionLine,
} from './option.js';

import { PULSE_MULTIPLIER } from './pulse.js';

describe('ksh/ast/option', function() {
    describe("parseOption and stringifyOption", function() {
        function testOption(key: string, value: string, expected_obj_part: object, stringified_value?: string) {
            const expected_stringified = `${key}=${stringified_value ?? value}`;
            it(`should correctly handle \`${key}=${value}\` -> \`${expected_stringified}\``, function() {
                const parsed = parseOption(key, value);
                
                assert.deepInclude(parsed, expected_obj_part);
                assert.strictEqual(parsed.key, key);
                assert.notOk(isUnknownOption(parsed));
        
                const stringified = stringifyOption(parsed);
                assert.strictEqual(stringified, expected_stringified);
            });
        }

        context("simple string options", function() {
            testOption('title', 'Test Song', { title: 'Test Song' });
            testOption('artist', 'Test Artist', { artist: 'Test Artist' });
            testOption('effect', 'Chart Author', { effect: 'Chart Author' });
            testOption('jacket', 'jacket.png', { jacket: 'jacket.png' });
            testOption('illustrator', 'Illustrator', { illustrator: 'Illustrator' });
            testOption('ver', '171', { version: '171' });
            testOption('information', 'Some useless info', { information: 'Some useless info' });
            testOption('filtertype', 'hpf1', { filter_type: 'hpf1' });
        });

        context("numeric options", function() {
            testOption('level', '15', { level: 15 });
            testOption('mvol', '80', { volume: 80 });
            testOption('o', '-100', { offset: -100 });
            testOption('total', '200', { total: 200 });
            testOption('pfiltergain', '75', { gain: 75 });
            testOption('zoom_top', '100', { zoom: 100 });
            testOption('center_split', '-50', { split: -50 });
            testOption('fx-l_param1', '12', { fx_lane: 0, param: 12 });
        });

        context("invalid numeric options", function() {
            testOption('level', 'abc', { level: 1 }, 'abc');
            testOption('mvol', 'baka', { volume: 100 }, 'baka');
        });

        context("difficulty", function() {
             testOption('difficulty', 'light', { difficulty: 0 }, 'light');
             testOption('difficulty', 'challenge', { difficulty: 1 }, 'challenge');
             testOption('difficulty', 'extended', { difficulty: 2 }, 'extended');
             testOption('difficulty', 'infinite', { difficulty: 3 }, 'infinite');
             testOption('difficulty', 'Another', { difficulty: 3 }, 'Another');
        });

        context("tempo", function() {
            testOption('t', '180', { bpm: 180 });
            testOption('t', '180.5', { bpm: 180.5 });
            testOption('t', '120-240', { bpm: '120-240' });
        });

        context("beat", function() {
            testOption('beat', '3/4', { time_sig: [3, 4] });
            testOption('beat', '5/8', { time_sig: [5, 8] });
        });

        context("options with lists", function() {
            testOption('m', 'song.ogg', { music: ['song.ogg'] });
            testOption('m', 'song.ogg;fx.ogg', { music: ['song.ogg', 'fx.ogg'] });
            testOption('bg', 'bg1.jpg;bg2.jpg', { background: ['bg1.jpg', 'bg2.jpg'] });
        });
        
        context("layer", function() {
            testOption('layer', 'snow', { name: 'snow' });
            testOption('layer', 'sakura;1000;1', {  name: 'sakura', loop_time_ms: 1000, rotation: 1 });
            testOption('layer', 'wave;500', {  name: 'wave', loop_time_ms: 500 });
        });
        
        context("boolean options", function() {
            testOption('chokkakuautovol', '1', { enabled: true });
            testOption('chokkakuautovol', '0', { enabled: false });
        });

        context("pulse options", function() {
            testOption('stop', '192', { duration: 192 * PULSE_MULTIPLIER });
        });

        context("tilt option", function() {
            testOption('tilt', 'bigger', { tilt: 'bigger' });
            testOption('tilt', '12.5', { tilt: 12.5 });
        });

        context("laser range option", function() {
            testOption('laserrange_l', '2x', { fx_lane: 0, range: 2 });
            testOption('laserrange_r', '1x', { fx_lane: 1, range: 1 });
        });

        context("fx effects", function() {
            testOption('fx-l', 'Retrigger', { fx_lane: 0, effect_name: 'Retrigger', effect_params: [] });
            testOption('fx-r', 'Retrigger;16', { fx_lane: 1, effect_name: 'Retrigger', effect_params: [16] });
            testOption('fx-l', 'Echo;4;60', { fx_lane: 0, effect_name: 'Echo', effect_params: [4, 60] });
        });

        context("fx sound effects", function() {
            testOption('fx-l_se', 'clap', { fx_lane: 0, effect_name: 'clap' });
            testOption('fx-r_se', 'snare;80', { fx_lane: 1, effect_name: 'snare', effect_volume: 80 });
        });

        context("slam effects", function() {
            testOption('chokkakuse', 'up', { sound_effect: 'up' });
            testOption('chokkakuse', 'mute', { sound_effect: 'mute' });
        });

        context("unknown effects", function() {
            it("should parse an unknown option correctly", function() {
                const parsed = parseOption("foo", "bar") as UnknownOptionLine;
                assert.isTrue(parsed.unknown);
                assert.strictEqual(parsed.key, "foo");
                assert.strictEqual(parsed.raw, "bar");
            });
            it('should stringify an unknown option correctly', function() {
                const parsed = parseOption("foo", "bar");
                const stringified = stringifyOption(parsed);
                assert.strictEqual(stringified, 'foo=bar');
            });
        });
    });
    
    describe("stringifyOption (from scratch)", function() {
        it('should stringify a difficulty option correctly', function() {
            const opt: DifficultyOptionLine = { type: 'option', key: 'difficulty', difficulty: 1 };
            assert.strictEqual(stringifyOption(opt), 'difficulty=challenge');
        });

        it('should stringify a beat option correctly', function() {
            const opt: BeatOptionLine = { type: 'option', key: 'beat', time_sig: [5, 4] };
            assert.strictEqual(stringifyOption(opt), 'beat=5/4');
        });
        
        it('should stringify a layer option with all params', function() {
            const opt: LayerOptionLine = { type: 'option', key: 'layer', name: 'test', loop_time_ms: 123, rotation: 3 };
            assert.strictEqual(stringifyOption(opt), 'layer=test;123;3');
        });

        it('should stringify a layer option with just loop time', function() {
            const opt: LayerOptionLine = { type: 'option', key: 'layer', name: 'test', loop_time_ms: 123 };
            assert.strictEqual(stringifyOption(opt), 'layer=test;123');
        });
        
        it('should stringify an fx option with weird params', function() {
            const opt: FXOptionLine = { type: 'option', key: 'fx-l', fx_lane: 0, effect_name: 'MyEffect', effect_params: [1, 'two'] };
            assert.strictEqual(stringifyOption(opt), 'fx-l=MyEffect;1;two');
        });

        it('should stringify an fx_se option without volume', function() {
            const opt: FXSoundEffectOptionLine = { type: 'option', key: 'fx-r_se', fx_lane: 1, effect_name: 'clap' };
            assert.strictEqual(stringifyOption(opt), 'fx-r_se=clap');
        });

        it('should stringify a stop option', function() {
            const opt: StopOptionLine = { type: 'option', key: 'stop', duration: 192 * PULSE_MULTIPLIER };
            assert.strictEqual(stringifyOption(opt), 'stop=192');
        });
    });

    describe("isUnknownOption", function() {
        it('should return true for unknown options', function() {
            const parsed = parseOption('foo', 'bar');
            assert.isTrue(isUnknownOption(parsed));
        });

        it("should return false for known options", function() {
            const parsed = parseOption('title', 'song name');
            assert.isFalse(isUnknownOption(parsed));
        });
    });
});