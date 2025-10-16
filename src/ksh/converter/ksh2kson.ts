import { AudioEffectInfo, AudioInfo, BGMInfo, BGMPreviewInfo, BGInfo, CompatInfo, GaugeInfo, KSON, KSON_VERSION, LegacyBGMInfo, LegacyBGInfo, MetaInfo, NoteInfo, TimeSig, BeatInfo, KSHMovieInfo, KeySoundLaserInfo, KeySoundLaserLegacyInfo, AudioEffectLaserInfo, KSHLayerInfo, KSHUnknownInfo, EditorInfo } from "../../kson/index.js";
import { difficultyToInt, TICKS_PER_WHOLE_NOTE } from "./common.js";
import { KSH, stringifyLine } from "../ast/index.js";

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
    readonly #note_info: NoteInfo = {};

    #ksh_version: string | null = null;
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
                case 'title':       this.#meta_info.title               = value;                  break;
                case 'title_img':   this.#meta_info.title_img_filename  = value;                  break;
                case 'artist':      this.#meta_info.artist              = value;                  break;
                case 'artist_img':  this.#meta_info.artist_img_filename = value;                  break;
                case 'effect':      this.#meta_info.chart_author        = value;                  break;
                case 'jacket':      this.#meta_info.jacket_filename     = value;                  break;
                case 'illustrator': this.#meta_info.jacket_author       = value;                  break;
                case 'difficulty':  this.#meta_info.difficulty          = difficultyToInt(value); break;
                case 'level':       this.#meta_info.level               = parseInt(value, 10);    break;
                case 'information': this.#meta_info.information         = value;                  break;

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
                    let vol = parseInt(value, 10) / 100.0;
                    if (this.#ksh_version === null) vol *= 0.6;
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
                    this.#ksh_version = value;
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

        let pulse = 0;
        let time_sig = this.#initial_time_sig;
        let next_time_sig = time_sig;

        for (const measure of this.#ksh.body) {
            let measure_pulse_len = TICKS_PER_WHOLE_NOTE * time_sig[0];
            if(measure_pulse_len % time_sig[1] !== 0) {
                throw new Error(`Invalid time signature for measure on line ${measure.line_no+1}!`);
            }
            measure_pulse_len /= time_sig[1];

            const measure_line_count = measure.lines.reduce((x, y) => x + Number(y.type === 'chart'), 0);
            if(measure_pulse_len % measure_line_count !== 0) {
                throw new Error(`Invalid measure length for measure on line ${measure.line_no+1}!`);
            }

            const pulse_per_line = measure_pulse_len / measure_line_count;

            for(const line of measure.lines) {
                switch(line.type) {
                    case 'chart': {
                        pulse += pulse_per_line;
                        break;
                    }
                    case 'option': {
                        switch(line.key) {
                            case 'beat': {
                                next_time_sig = parseTimeSig(line.value);
                                break;
                            }
                        }
                        break;
                    }
                    case 'comment': {
                        const editor_info = this.#getEditorInfo();
                        const comments = editor_info.comment ?? (editor_info.comment = []);

                        comments.push([pulse, line.comment]);

                        break;
                    }
                    case 'unknown': {
                        const ksh_unknown_info = this.#getKSHUnknownInfo();
                        const unknown_lines = ksh_unknown_info.line ?? (ksh_unknown_info.line = []);

                        unknown_lines.push([pulse, stringifyLine(line)]);

                        break;
                    }
                }
            }

            time_sig = next_time_sig;
        }
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
