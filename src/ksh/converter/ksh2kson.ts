import { AudioEffectInfo, AudioInfo, BGMInfo, BGMPreviewInfo, BGInfo, CompatInfo, GaugeInfo, KSON, KSON_VERSION, LegacyBGMInfo, LegacyBGInfo, MetaInfo, NoteInfo, TimeSig, BeatInfo, KSHMovieInfo, KeySoundLaserInfo, KeySoundLaserLegacyInfo, AudioEffectLaserInfo, KSHLayerInfo, KSHUnknownInfo, EditorInfo, GraphSectionPoint, ButtonLane, LaserLane } from "../../kson/index.js";
import { ChartLine, CommentLine, KSH, Measure, OptionLine, stringifyLine, UnknownLine } from "../ast/index.js";
import { Pulse, PULSES_PER_WHOLE, SLAM_THRESHOLD } from "../ast/pulse.js";
import { NoteType } from "../ast/note.js";
import { LASER_CONTINUE, LASER_POS_MAX, LaserInd } from "../ast/laser.js";
import { isUnknownOption } from "../ast/option.js";

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
        if(isUnknownOption(line)) continue;
        if(line.key !== 'beat') continue;
        return line.time_sig satisfies TimeSig;
    }
    
    return null;
}

interface ButtonState {
    long_y: number|null;
}

function createButtonState(): ButtonState {
    return { long_y: null };
}

interface LaserState {
    curr_section: { y: number; v: GraphSectionPoint[]; w: number; }|null;
    wide: boolean;
}

function createLaserState(): LaserState {
    return { curr_section: null, wide: false };
}

interface BodyProcessState {
    pulse: number;
    
    time_sig: TimeSig;
    next_time_sig: TimeSig;

    bt_states: [ButtonState, ButtonState, ButtonState, ButtonState];
    fx_states: [ButtonState, ButtonState];
    laser_states: [LaserState, LaserState];

    scroll_speed_changes: Array<[pulse: Pulse, delta: number]>;
}

function createBodyProcessState(): BodyProcessState {
    return {
        pulse: 0,

        time_sig: [4, 4],
        next_time_sig: [4, 4],

        bt_states: [createButtonState(), createButtonState(), createButtonState(), createButtonState()],
        fx_states: [createButtonState(), createButtonState()],
        laser_states: [createLaserState(), createLaserState()],

        scroll_speed_changes: [],
    };
}

function toScrollSpeeds(changes: Array<[pulse: Pulse, delta: number]>): Array<[pulse: number, [from: number, to: number]]> {
    const scroll_speeds: Array<[pulse: number, [from: number, to: number]]> = [[0, [1.0, 1.0]]];

    for(const [pulse, delta] of changes.sort((a, b) => a[0] - b[0])) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const last_point = scroll_speeds.at(-1)!;
        if(pulse < last_point[0]) throw new Error(`Unexpected pulse=${pulse} last_point[0]=${last_point[0]}!`);

        if(last_point[0] === pulse) {
            last_point[1][1] += delta;
        } else {
            scroll_speeds.push([pulse, [last_point[1][1], last_point[1][1] + delta]]);
        }
    }

    return scroll_speeds;
}

const KSH_LASER_FX = 'ksh_laser_fx';

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

    #getKSHUnknownLines(): NonNullable<KSHUnknownInfo['line']> {
        const ksh_unknown_info = this.#getKSHUnknownInfo();
        return ksh_unknown_info.line ?? (ksh_unknown_info.line = []);
    }

    #getKSHUnknownMeta(): NonNullable<KSHUnknownInfo['meta']> {
        const ksh_unknown_info = this.#getKSHUnknownInfo();
        return ksh_unknown_info.meta ?? (ksh_unknown_info.meta = {});
    }

    #getKSHUnknownOptions(key: string) {
        const ksh_unknown_info = this.#getKSHUnknownInfo();
        const options = (ksh_unknown_info.option ?? (ksh_unknown_info.option = {}));
        return (options[key] ?? (options[key] = []));
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

    #getAudioEffectLaserInfo(): AudioEffectLaserInfo {
        const audio_effect = this.#getAudioEffectInfo();
        return audio_effect.laser ?? (audio_effect.laser = AudioEffectLaserInfo.assert({}));
    }

    #handleFilterType(name: string): string {
        if(name !== "fx" && name !== "fx;bitc") {
            return name;
        }

        const fp_filenames = this.#audio_info?.bgm?.legacy?.fp_filenames;
        if(!fp_filenames || fp_filenames.length === 0) {
            return ''; // No effect
        }

        const filename = fp_filenames[0];
        const laser = this.#getAudioEffectLaserInfo();
        const def = laser.def ?? (laser.def = {});

        if(!def[KSH_LASER_FX]) {
            def[KSH_LASER_FX] = { type: 'switch_audio', v: { filename } };
        }

        return KSH_LASER_FX;
    }

    #kshFilterTypeToKSON(filter_type: string): string | null {
        switch(filter_type) {
            case 'peak': return 'peaking_filter';
            case 'hpf1': return 'high_pass_filter';
            case 'lpf1': return 'low_pass_filter';
            case 'bitc': return 'bitcrusher';
            case KSH_LASER_FX: return KSH_LASER_FX;
            case '': return null; // No effect
            default: // user-defined
                return filter_type;
        }
    }
    
    #addLaserEffectPulseEvent(pulse: number, ksh_effect_name: string) {
        ksh_effect_name = this.#handleFilterType(ksh_effect_name);
        const kson_effect_name = this.#kshFilterTypeToKSON(ksh_effect_name) ?? ksh_effect_name;

        const laser_effect = this.#getAudioEffectLaserInfo();
        const pulse_event = laser_effect.pulse_event ?? (laser_effect.pulse_event = {});
        const events = pulse_event[kson_effect_name] ?? (pulse_event[kson_effect_name] = []);
        
        if (events.at(-1) !== pulse) {
            events.push(pulse);
        }
    }

    #processHeader() {
        for (const line of this.#ksh.header) {
            if (line.type !== 'option') {
                this.#getKSHUnknownLines().push([0, stringifyLine(line)]);
                continue;
            }

            if(isUnknownOption(line)) {
                this.#getKSHUnknownMeta()[line.key] = line.raw ?? "";
                continue;
            }

            switch(line.key) {
                // Meta
                case 'title':       this.#meta_info.title               = line.title;       break;
                case 'title_img':   this.#meta_info.title_img_filename  = line.title_img;   break;
                case 'artist':      this.#meta_info.artist              = line.artist;      break;
                case 'artist_img':  this.#meta_info.artist_img_filename = line.artist_img;  break;
                case 'effect':      this.#meta_info.chart_author        = line.effect;      break;
                case 'jacket':      this.#meta_info.jacket_filename     = line.jacket;      break;
                case 'illustrator': this.#meta_info.jacket_author       = line.illustrator; break;
                case 'difficulty':  this.#meta_info.difficulty          = line.difficulty;  break;
                case 'level':       this.#meta_info.level               = line.level;       break;
                case 'information': this.#meta_info.information         = line.information; break;
                
                // Beat
                case 't':
                    this.#meta_info.disp_bpm = line.raw ?? String(line.bpm);
                    if (typeof line.bpm === 'number') {
                        this.#initial_bpm = line.bpm;
                    }
                    break;
                case 'to': this.#meta_info.std_bpm = line.bpm; break;
                case 'beat': this.#initial_time_sig = line.time_sig; break;
                
                // Gauge
                case 'total': this.#getGaugeInfo().total = line.total; break;

                // Audio
                case 'm': {
                    this.#getBGMInfo().filename = line.music[0];
                    if (line.music.length > 1) {
                        this.#getBGMLegacyInfo().fp_filenames = line.music.slice(1);
                    }
                    break;
                }
                case 'mvol': {
                    this.#getBGMInfo().vol = line.volume / 100.0;
                    break;
                }
                case 'o': this.#getBGMInfo().offset = line.offset; break;
                case 'po': this.#getBGMPreviewInfo().offset = line.offset; break;
                case 'plength': this.#getBGMPreviewInfo().duration = line.length; break;
                case 'chokkakuvol':
                    this.#getKeySoundLaser().vol = [[0, line.volume / 100.0]];
                    break;
                case 'chokkakuautovol':
                    this.#getKeySoundLaserLegacy().vol_auto = line.enabled;
                    break;
                case 'pfilterdelay': {
                    const effect = this.#getAudioEffectInfo();
                    const laser = effect.laser ?? (effect.laser = AudioEffectLaserInfo.assert({}));
                    laser.peaking_filter_delay = line.delay;
                    break;
                }
                
                // BG
                case 'bg': {
                    const legacy = this.#getBGLegacyInfo();
                    if (line.background.length === 1) {
                        legacy.bg = [{ filename: line.background[0] }];
                    } else if (line.background.length === 2) {
                        legacy.bg = [{ filename: line.background[0] }, { filename: line.background[1] }];
                    }
                    break;
                }
                case 'layer': {
                    const legacy = this.#getBGLegacyInfo();
                    const layer = legacy.layer ?? (legacy.layer = KSHLayerInfo.assert({}));
                    layer.filename = line.name;
                    if (line.loop_time_ms != null) {
                        layer.duration = line.loop_time_ms;
                    }
                    if (line.rotation != null && line.rotation > 0) {
                        layer.rotation = {
                            tilt: (line.rotation & 1) !== 0,
                            spin: (line.rotation & 2) !== 0,
                        };
                    }
                    break;
                }
                case 'v': this.#getBGLegacyMovieInfo().filename = line.video; break;
                case 'vo': this.#getBGLegacyMovieInfo().offset = line.offset; break;

                // Compat
                case 'ver':
                    this.#getCompatInfo().ksh_version = line.version;
                    break;
                
                case 'filtertype':
                    this.#addLaserEffectPulseEvent(0, line.filter_type);
                    break;

                case 'pfiltergain': {
                    const laser = this.#getAudioEffectLaserInfo();
                    const param_change = laser.param_change ?? (laser.param_change = {});
                    const peaking_filter_params = param_change['peaking_filter'] ?? (param_change['peaking_filter'] = {});
                    const gain_changes = peaking_filter_params['gain'] ?? (peaking_filter_params['gain'] = []);
                    gain_changes.push([0, `${line.gain}%`])
                    break;
                }
                
                // Options that can't be in a header.
                default: {
                    this.#getKSHUnknownMeta()[line.key] = line.raw ?? "";
                    break;
                }
            }
        }

        const ver = this.#compat_info?.ksh_version;
        if (ver == null) {
            const bgm = this.#audio_info?.bgm;
            if (bgm?.vol != null) {
                bgm.vol *= 0.6;
            }
        }
    }

    #processBody() {
        this.#beat_info.bpm.push([0, this.#initial_bpm]);
        this.#beat_info.time_sig.push([0, this.#initial_time_sig]);
        this.#beat_info.scroll_speed.push([0, [1.0, 1.0]]);

        const state: BodyProcessState = createBodyProcessState();
        state.time_sig = state.next_time_sig = this.#initial_time_sig;

        for (let i=0; i<this.#ksh.body.length; ++i) {
            this.#processMeasure(state, this.#ksh.body[i], i);
        }

        // Finalize any open long notes.
        const final_pulse = state.pulse;

        for(let i=0; i<4; ++i) {
            const y = state.bt_states[i].long_y;
            if(y == null) continue;
            
            this.#note_info.bt[i].push([y, final_pulse - y]);
        }
        
        for(let i=0; i<2; ++i) {
            const y = state.fx_states[i].long_y;
            if(y == null) continue;
            
            this.#note_info.fx.push([y, final_pulse - y]);
        }

        // Finalize laser sections
        for (let i = 0; i < 2; i++) {
            const section = state.laser_states[i].curr_section;
            if(section == null) continue;
            
            this.#note_info.laser[i].push([section.y, section.v, section.w]);
        }

        // Handle `stop` scroll speed changes.
        this.#beat_info.scroll_speed = toScrollSpeeds(state.scroll_speed_changes);
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

        let measure_pulse_len = PULSES_PER_WHOLE * time_sig[0];
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
        }

        state.time_sig = state.next_time_sig;
    }

    #processMeasureChart(state: BodyProcessState, line: ChartLine) {
        for (let i = 0; i < 4; ++i) {
            this.#processButtonNote(state.pulse, state.bt_states[i], this.#note_info.bt[i], line.bt[i]);
        }

        for (let i = 0; i < 2; ++i) {
            this.#processButtonNote(state.pulse, state.fx_states[i], this.#note_info.fx[i], line.fx[i]);
        }

        for (let i=0; i < 2; ++i) {
            this.#processLaser(state.pulse, state.laser_states[i], this.#note_info.laser[i], line.laser[i]);
        }
    }

    #processButtonNote(pulse: number, state: ButtonState, target: ButtonLane, note: NoteType) {
        const prev_long_y = state.long_y;
        const is_prev_long = prev_long_y !== null;

        // Long note
        if(note === NoteType.LONG) {
            if(!is_prev_long) state.long_y = pulse;
        } else {
            if(is_prev_long) {
                target.push([prev_long_y, pulse - prev_long_y]);
                state.long_y = null;
            }
            if (note === NoteType.CHIP) {
                target.push(pulse);
            }
        }
    }

    #processLaser(pulse: number, state: LaserState, target: LaserLane, laser: LaserInd|null) {
        if (laser === null) {
            if (state.curr_section) {
                target.push([state.curr_section.y, state.curr_section.v, state.curr_section.w]);
                state.curr_section = null;
            }
            return;
        }

        if (laser === LASER_CONTINUE) {
            return;
        }
        
        const value = laser / LASER_POS_MAX;

        if (!state.curr_section) {
            state.curr_section = {
                y: pulse,
                v: [[0, [value, value]]],
                w: state.wide ? 2 : 1,
            };
            state.wide = false;
            return;
        }

        const ry = pulse - state.curr_section.y;
        const last_point = state.curr_section.v.at(-1);
        if(last_point == null) throw new Error(`processLaser internal error: unexpected laser state at pulse=${pulse}`);

        if (ry <= last_point[0] + SLAM_THRESHOLD) {
            last_point[1][1] = value;
        } else {
            state.curr_section.v.push([ry, [value, value]]);
        }
    }

    #processMeasureOption(state: BodyProcessState, line: OptionLine, first_chart_line_passed: boolean) {
        if (isUnknownOption(line)) {
            this.#getKSHUnknownOptions(line.key).push([state.pulse, line.raw ?? ""]);
            return;
        }

        switch(line.key) {
            case 'beat': {
                if(first_chart_line_passed) {
                    state.next_time_sig = line.time_sig;
                }
                break;
            }
            case 't': {
                if(typeof line.bpm !== 'number') break;

                const new_bpm = line.bpm;
                const last_bpm = this.#beat_info.bpm.at(-1);
                if(last_bpm?.[0] === state.pulse) {
                    last_bpm[1] = new_bpm;
                } else {
                    this.#beat_info.bpm.push([state.pulse, new_bpm]);
                }
                break;
            }
            case 'laserrange_l':
            case 'laserrange_r': {
                state.laser_states[line.fx_lane].wide = line.range === 2;
                break;
            }
            case 'filtertype':
                this.#addLaserEffectPulseEvent(state.pulse, line.filter_type);
                break;
            case 'pfiltergain': {
                const laser = this.#getAudioEffectLaserInfo();
                const param_change = laser.param_change ?? (laser.param_change = {});
                const peaking_filter_params = param_change['peaking_filter'] ?? (param_change['peaking_filter'] = {});
                const gain_changes = peaking_filter_params['gain'] ?? (peaking_filter_params['gain'] = []);
                const gain_val = `${line.gain}%`;

                const last_change = gain_changes.at(-1);
                if(last_change?.[0] === state.pulse) {
                    last_change[1] = gain_val;
                } else {
                    gain_changes.push([state.pulse, gain_val]);
                }
                break;
            }
            case 'chokkakuvol': {
                const vol = line.volume / 100.0;
                const laser_vol = this.#getKeySoundLaser().vol ?? (this.#getKeySoundLaser().vol = []);
                const last_vol = laser_vol.at(-1);
                if(last_vol?.[0] === state.pulse) {
                    last_vol[1] = vol;
                } else {
                    laser_vol.push([state.pulse, vol]);
                }
                break;
            }
            case 'stop': {
                state.scroll_speed_changes.push([state.pulse, -1.0]);
                state.scroll_speed_changes.push([state.pulse + line.duration, 1.0]);
                break;
            }
            // TODO: tilt
            // TODO: zoom_*, center_split
            // TODO: fx-*, laserrange_*, etc.
            default: {
                this.#getKSHUnknownOptions(line.key).push([state.pulse, line.raw ?? ""]);
                break;
            }
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
