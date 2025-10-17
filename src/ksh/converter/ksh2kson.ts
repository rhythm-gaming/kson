import { AudioEffectInfo, AudioInfo, BGMInfo, BGMPreviewInfo, BGInfo, CompatInfo, GaugeInfo, KSON, KSON_VERSION, LegacyBGMInfo, LegacyBGInfo, MetaInfo, NoteInfo, TimeSig, BeatInfo, KSHMovieInfo, KeySoundLaserInfo, KeySoundLaserLegacyInfo, AudioEffectLaserInfo, KSHLayerInfo, KSHUnknownInfo, EditorInfo } from "../../kson/index.js";
import { normalizeDifficulty, TICKS_PER_WHOLE_NOTE } from "./common.js";
import { ChartLine, CommentLine, KSH, Measure, OptionLine, stringifyLine, UnknownLine } from "../ast/index.js";

function parseTimeSig(value: string): TimeSig {
    const parts = value.split('/');
    if (parts.length !== 2) throw new Error(`Invalid time signature: ${value}`);

    const n = parseInt(parts[0], 10);
    const d = parseInt(parts[1], 10);

    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || n <= 0 || d <= 0) {
        throw new Error(`Invalid time signature: ${value}`);
    }

    return [n, d];
}

/**
 * Get the time signature specified at the beginning of the measure.
 * 
 * This function considers all option lines before the first chart line,
 * which is a little bit more lax than the spec.
 * 
 * @param measure
 * @returns 
 */
function getInitialTimeSig({lines}: Measure): TimeSig|null {
    for(const line of lines) {
        if(line.type === 'chart') return null;
        if(line.type !== 'option') continue;
        if(line.key !== 'beat') continue;

        return parseTimeSig(line.value);
    }
    
    return null;
}

interface BodyProcessState {
    pulse: number;
    time_sig: TimeSig;
    next_time_sig: TimeSig;
}

export class KSH2KSONConverter {
    readonly #ksh: KSH;

    readonly #meta_info: MetaInfo = {
        title: "",
        artist: "",
        chart_author: "",
        difficulty: 0,
        level: 1,
        disp_bpm: '120',
    };

    readonly #beat_info: BeatInfo = {
        bpm: [],
        time_sig: [],
        scroll_speed: [],
    };

    #gauge_info: GaugeInfo | null = null;
    #audio_info: AudioInfo | null = null;
    #bg_info: BGInfo | null = null;
    #editor_info: EditorInfo | null = null;
    #compat_info: CompatInfo | null = null;

    readonly #note_info: NoteInfo = {
        bt: [[], [], [], []],
        fx: [[], []],
        laser: [[], []],
    };

    #bt_long_note_y: (number | null)[] = [null, null, null, null];
    #fx_long_note_y: (number | null)[] = [null, null];

    #initial_bpm: number = 120.0;
    #initial_time_sig: TimeSig = [4, 4];

    constructor(ksh: KSH) {
        this.#ksh = ksh;

        this.#processHeader();
        this.#processBody();
    }

    #getGaugeInfo(): GaugeInfo {
        return this.#gauge_info ?? (this.#gauge_info = GaugeInfo.assert({}));
    }

    #getAudioInfo(): AudioInfo {
        return this.#audio_info ?? (this.#audio_info = {});
    }

    #getBGMInfo(): BGMInfo {
        const audio = this.#getAudioInfo();
        return audio.bgm ?? (audio.bgm = BGMInfo.assert({}));
    }

    #getBGMPreviewInfo(): BGMPreviewInfo {
        const bgm = this.#getBGMInfo();
        return bgm.preview ?? (bgm.preview = BGMPreviewInfo.assert({}));
    }

    #getBGMLegacyInfo(): LegacyBGMInfo {
        const bgm = this.#getBGMInfo();
        return bgm.legacy ?? (bgm.legacy = LegacyBGMInfo.assert({fp_filenames: []}));
    }

    #getAudioEffectInfo(): AudioEffectInfo {
        const audio = this.#getAudioInfo();
        return audio.audio_effect ?? (audio.audio_effect = {});
    }

    #getBGInfo(): BGInfo {
        return this.#bg_info ?? (this.#bg_info = BGInfo.assert({}));
    }

    #getBGLegacyInfo(): LegacyBGInfo {
        const bg = this.#getBGInfo();
        return bg.legacy ?? (bg.legacy = {});
    }

    #getBGLegacyMovieInfo() {
        const legacy = this.#getBGLegacyInfo();
        return legacy.movie ?? (legacy.movie = KSHMovieInfo.assert({}));
    }

    #getEditorInfo(): EditorInfo {
        return this.#editor_info ?? (this.#editor_info = {});
    }

    #getCompatInfo(): CompatInfo {
        return this.#compat_info ?? (this.#compat_info = {});
    }

    #getKSHUnknownInfo(): KSHUnknownInfo {
        const compat = this.#getCompatInfo();
        return compat.ksh_unknown ?? (compat.ksh_unknown = {});
    }

    #getKeySound() {
        const audio = this.#getAudioInfo();
        return audio.key_sound ?? (audio.key_sound = {});
    }

    #getKeySoundLaser() {
        const keySound = this.#getKeySound();
        return keySound.laser ?? (keySound.laser = KeySoundLaserInfo.assert({}));
    }

    #getKeySoundLaserLegacy() {
        const laser = this.#getKeySoundLaser();
        return laser.legacy ?? (laser.legacy = KeySoundLaserLegacyInfo.assert({}));
    }

    #processHeader() {
        for (const line of this.#ksh.header) {
            if (line.type !== 'option') {
                const ksh_unknown_info = this.#getKSHUnknownInfo();
                const unknown_lines = ksh_unknown_info.line ?? (ksh_unknown_info.line = []);

                unknown_lines.push([0, stringifyLine(line)]);

                continue;
            }

            const { key, value } = line;

            switch (key) {
                // Meta
                case 'title':       this.#meta_info.title               = value;                      break;
                case 'title_img':   this.#meta_info.title_img_filename  = value;                      break;
                case 'artist':      this.#meta_info.artist              = value;                      break;
                case 'artist_img':  this.#meta_info.artist_img_filename = value;                      break;
                case 'effect':      this.#meta_info.chart_author        = value;                      break;
                case 'jacket':      this.#meta_info.jacket_filename     = value;                      break;
                case 'illustrator': this.#meta_info.jacket_author       = value;                      break;
                case 'difficulty':  this.#meta_info.difficulty          = normalizeDifficulty(value); break;
                case 'level':       this.#meta_info.level               = parseInt(value, 10);        break;
                case 'information': this.#meta_info.information         = value;                      break;

                // Beat
                case 't':
                    this.#meta_info.disp_bpm = value;
                    if (!value.includes('-')) {
                        this.#initial_bpm = parseFloat(value);
                    }
                    break;
                case 'to': this.#meta_info.std_bpm = parseFloat(value); break;
                case 'beat': this.#initial_time_sig = parseTimeSig(value); break;

                // Gauge
                case 'total': this.#getGaugeInfo().total = parseInt(value, 10); break;

                // Audio
                case 'm': {
                    const files = value.split(';');
                    this.#getBGMInfo().filename = files[0];
                    if (files.length > 1) {
                        this.#getBGMLegacyInfo().fp_filenames = files;
                    }
                    break;
                }
                case 'mvol': {
                    const vol = parseInt(value, 10) / 100.0;
                    // if (this.#ksh_version === null) vol *= 0.6;
                    this.#getBGMInfo().vol = vol;
                    break;
                }
                case 'o': this.#getBGMInfo().offset = parseInt(value, 10); break;
                case 'po': this.#getBGMPreviewInfo().offset = parseInt(value, 10); break;
                case 'plength': this.#getBGMPreviewInfo().duration = parseInt(value, 10); break;
                case 'chokkakuvol':
                    this.#getKeySoundLaser().vol = [[0, parseInt(value, 10) / 100.0]];
                    break;
                case 'chokkakuautovol':
                    this.#getKeySoundLaserLegacy().vol_auto = value === '1';
                    break;
                case 'pfilterdelay': {
                    const effect = this.#getAudioEffectInfo();
                    const laser = effect.laser ?? (effect.laser = AudioEffectLaserInfo.assert({}));
                    laser.peaking_filter_delay = parseInt(value, 10);
                    break;
                }

                // BG
                case 'bg': {
                    const files = value.split(';');
                    const legacy = this.#getBGLegacyInfo();
                    if (files.length === 1) {
                        legacy.bg = [{ filename: files[0] }];
                    } else if (files.length === 2) {
                        legacy.bg = [{ filename: files[0] }, { filename: files[1] }];
                    }
                    break;
                }
                case 'layer': {
                    const legacy = this.#getBGLegacyInfo();
                    const layer = legacy.layer ?? (legacy.layer = KSHLayerInfo.assert({}));
                    const parts = value.split(';');
                    layer.filename = parts[0];
                    if (parts.length > 1) {
                        layer.duration = parseInt(parts[1], 10);
                    }
                    if (parts.length > 2) {
                        const rotationFlags = parseInt(parts[2], 10);
                        if (rotationFlags > 0) {
                            layer.rotation = {
                                tilt: (rotationFlags & 1) !== 0,
                                spin: (rotationFlags & 2) !== 0,
                            };
                        }
                    }
                    break;
                }
                case 'v': this.#getBGLegacyMovieInfo().filename = value; break;
                case 'vo': this.#getBGLegacyMovieInfo().offset = parseInt(value, 10); break;

                // Compat
                case 'ver':
                    this.#getCompatInfo().ksh_version = value;
                    break;
                
                default: {
                    const ksh_unknown_info = this.#getKSHUnknownInfo();
                    const unknown_meta = ksh_unknown_info.meta ?? (ksh_unknown_info.meta = {});
                    unknown_meta[key] = value;
                }
            }
        }
    }

    #processBody() {
        this.#beat_info.bpm.push([0, this.#initial_bpm]);
        this.#beat_info.time_sig.push([0, this.#initial_time_sig]);
        this.#beat_info.scroll_speed.push([0, [1.0, 1.0]]);

        const state: BodyProcessState = {
            pulse: 0,
            time_sig: this.#initial_time_sig,
            next_time_sig: this.#initial_time_sig,
        };

        for (let i=0; i<this.#ksh.body.length; ++i) {
            this.#processMeasure(state, this.#ksh.body[i], i);
        }

        // Finalize any open long notes.
        const final_pulse = state.pulse;

        for(let i=0; i<4; ++i) {
            const y = this.#bt_long_note_y[i];
            if(y == null) continue;
            
            this.#note_info.bt[i].push([y, final_pulse - y]);
            this.#bt_long_note_y[i] = null;
        }
        
        for(let i=0; i<2; ++i) {
            const y = this.#fx_long_note_y[i];
            if(y == null) continue;
            
            this.#note_info.fx.push([y, final_pulse - y]);
            this.#fx_long_note_y[i] = null;
        }
    }

    #processMeasure(state: BodyProcessState, measure: Measure, measure_idx: number) {
        const time_sig_from_measure = getInitialTimeSig(measure);
        if(time_sig_from_measure) {
            state.time_sig = time_sig_from_measure;
            const last_sig = this.#beat_info.time_sig.at(-1);

            if(!last_sig || last_sig[0] !== measure_idx) {
                if(last_sig?.[0] === measure_idx) this.#beat_info.time_sig.pop();
                this.#beat_info.time_sig.push([measure_idx, state.time_sig]);
            } else {
                last_sig[1] = state.time_sig;
            }
        }

        const time_sig = state.next_time_sig = state.time_sig;

        let measure_pulse_len = TICKS_PER_WHOLE_NOTE * time_sig[0];
        if(measure_pulse_len % time_sig[1] !== 0) {
            throw new Error(`Invalid time signature for measure on line ${measure.line_no+1}!`);
        }
        measure_pulse_len /= time_sig[1];

        const measure_line_count = measure.lines.reduce((x, y) => x + Number(y.type === 'chart'), 0);
        if(measure_line_count > 0 && measure_pulse_len % measure_line_count !== 0) {
            throw new Error(`Invalid measure length for measure on line ${measure.line_no+1}!`);
        }

        const pulse_per_line = measure_line_count > 0 ? measure_pulse_len / measure_line_count : 0;
        let first_chart_line_passed = false;

        for(const line of measure.lines) {
            switch(line.type) {
                case 'chart': {
                    first_chart_line_passed = true;
                    this.#processMeasureChart(state, line);
                    state.pulse += pulse_per_line;
                    break;
                }
                case 'option': this.#processMeasureOption(state, line, first_chart_line_passed); break;
                case 'comment': this.#processMeasureComment(state, line); break;
                case 'unknown': this.#processMeasureUnknown(state, line); break;
                default: throw new Error(`Unknown line type: ${(line as {type: string}).type}`);
            }

            state.pulse += pulse_per_line;
        }

        state.time_sig = state.next_time_sig;
    }

    #processMeasureChart(state: BodyProcessState, line: ChartLine) {
        // BT notes
        for (let i = 0; i < 4; i++) {
            const char = line.bt[i];
            const y = this.#bt_long_note_y[i];
            const is_long = y !== null;

            if (char === '2') { // Long note
                if (!is_long) {
                    this.#bt_long_note_y[i] = state.pulse;
                }
            } else {
                if (is_long) { // End of long note
                    this.#note_info.bt[i].push([y, state.pulse - y]);
                    this.#bt_long_note_y[i] = null;
                }
                if (char === '1') { // Chip note
                    this.#note_info.bt[i].push(state.pulse);
                }
            }
        }

        // FX notes
        for (let i = 0; i < 2; i++) {
            const char = line.fx[i];
            const y = this.#fx_long_note_y[i];
            const is_long = y !== null;

            // In current KSH, '1' is long note. Legacy used other chars.
            // '0' is empty, '2' is chip. Anything else is long.
            if (char !== '0' && char !== '2') { // Long note
                if(!is_long) {
                    this.#fx_long_note_y[i] = state.pulse;
                }
            } else {
                if (is_long) { // End of long note
                    this.#note_info.fx[i].push([y, state.pulse - y]);
                    this.#fx_long_note_y[i] = null;
                }
                if (char === '2') { // Chip note
                    this.#note_info.fx[i].push(state.pulse);
                }
            }
        }

        // TODO: Laser notes
    }

    #processMeasureOption(state: BodyProcessState, line: OptionLine, first_chart_line_passed: boolean) {
        const {key, value} = line;
        switch(key) {
            case 'beat': {
                if(first_chart_line_passed) {
                    state.next_time_sig = parseTimeSig(line.value);
                }
                break;
            }
            case 't': {
                const new_bpm = parseFloat(value);
                const last_bpm = this.#beat_info.bpm.at(-1);
                if(last_bpm?.[0] === state.pulse) {
                    last_bpm[1] = new_bpm;
                } else {
                    this.#beat_info.bpm.push([state.pulse, new_bpm]);
                }
                break;
            }
            case 'chokkakuvol': {
                const vol = parseInt(value, 10) / 100.0;
                const laser_vol = this.#getKeySoundLaser().vol ?? (this.#getKeySoundLaser().vol = []);
                const last_vol = laser_vol.at(-1);
                if(last_vol?.[0] === state.pulse) {
                    last_vol[1] = vol;
                } else {
                    laser_vol.push([state.pulse, vol]);
                }
                break;
            }
            // TODO: stop
            // TODO: tilt
            // TODO: zoom_*, center_split
            // TODO: fx-*, laserrange_*, filtertype, etc.
        }
    }

    #processMeasureComment(state: BodyProcessState, line: CommentLine) {
        const editor_info = this.#getEditorInfo();
        const comments = editor_info.comment ?? (editor_info.comment = []);

        comments.push([state.pulse, line.comment]);
    }

    #processMeasureUnknown(state: BodyProcessState, line: UnknownLine) {
        const ksh_unknown_info = this.#getKSHUnknownInfo();
        const unknown_lines = ksh_unknown_info.line ?? (ksh_unknown_info.line = []);

        unknown_lines.push([state.pulse, stringifyLine(line)]);
    }

    toKSON(): KSON {
        const kson: KSON = {
            version: KSON_VERSION,
            meta: this.#meta_info,
            beat: this.#beat_info,
            note: this.#note_info,
        };

        if (this.#gauge_info) kson.gauge = this.#gauge_info;
        if (this.#audio_info) kson.audio = this.#audio_info;
        if (this.#bg_info) kson.bg = this.#bg_info;
        if (this.#compat_info) kson.compat = this.#compat_info;

        return kson;
    }
}
