import { parsePulse, stringifyPulse, type Pulse } from "./pulse.js";

interface BaseOptionLine<K extends string = string> {
    readonly type: 'option';
    key: K;
    raw?: string;
}

export interface TitleOptionLine extends BaseOptionLine<'title'> {
    title: string;
}

export interface TitleImgOptionLine extends BaseOptionLine<'title_img'> {
    title_img: string;
}

export interface ArtistOptionLine extends BaseOptionLine<'artist'> {
    artist: string;
}

export interface ArtistImgOptionLine extends BaseOptionLine<'artist_img'> {
    artist_img: string;
}

export interface EffectOptionLine extends BaseOptionLine<'effect'> {
    effect: string;
}

export interface JacketOptionLine extends BaseOptionLine<'jacket'> {
    jacket: string;
}

export interface IllustratorOptionLine extends BaseOptionLine<'illustrator'> {
    illustrator: string;
}

export interface DifficultyOptionLine extends BaseOptionLine<'difficulty'> {
    difficulty: number;
}

export interface LevelOptionLine extends BaseOptionLine<'level'> {
    level: number;
}

export interface BPMOptionLine extends BaseOptionLine<'t'> {
    /** BPM. Can be a string like "120-180" if there are tempo changes. */
    bpm: number | string;
}

export interface StandardBPMOptionLine extends BaseOptionLine<'to'> {
    /** Standard BPM for Hi-speed values. 0 for automatic. */
    bpm: number;
}

export interface BeatOptionLine extends BaseOptionLine<'beat'> {
    time_sig: [beat_count: number, beat_unit: number];
}

export interface MusicOptionLine extends BaseOptionLine<'m'> {
    /**
     * Music filenames.
     * 1: default
     * 2: [default, fx]
     * 4: [default, fx, laser, fx+laser]
     */
    music: string[];
}

export interface MusicVolumeOptionLine extends BaseOptionLine<'mvol'> {
    /** Song volume in percent. */
    volume: number;
}

export interface OffsetOptionLine extends BaseOptionLine<'o'> {
    /** Song offset in milliseconds. */
    offset: number;
}

export interface BackgroundOptionLine extends BaseOptionLine<'bg'> {
    /**
     * Background filenames.
     * [default, gauge >= 70%]
     */
    background: string[];
}

export interface LayerOptionLine extends BaseOptionLine<'layer'> {
    name: string;
    /** Length of time for one loop in milliseconds. Negative for reverse. */
    loop_time_ms?: number;
    /**
     * 0: No rotation
     * +1: follows lane tilts
     * +2: follows lane spins
     */
    rotation?: 0 | 1 | 2 | 3;
}

export interface PreviewOffsetOptionLine extends BaseOptionLine<'po'> {
    /** Offset in milliseconds of preview in song selection. */
    offset: number;
}

export interface PreviewLengthOptionLine extends BaseOptionLine<'plength'> {
    /** Length in milliseconds of preview in song selection. */
    length: number;
}

export interface TotalOptionLine extends BaseOptionLine<'total'> {
    /** Total gauge percentage ascension. 0 for automatic. */
    total: number;
}

export interface SlamVolumeOptionLine extends BaseOptionLine<'chokkakuvol'> {
    /** Volume of laser slams in percent. */
    volume: number;
}

export interface SlamAutoVolumeOptionLine extends BaseOptionLine<'chokkakuautovol'> {
    /** Whether to change laser slam volume depending on laser width. */
    enabled: boolean;
}

export type LaserFilterTypeName = 'peak' | 'hpf1' | 'lpf1' | 'bitc' | 'fx' | 'fx;bitc';

export interface LaserFilterTypeOptionLine extends BaseOptionLine<'filtertype'> {
    /** The type of audio effects for laser notes. Can be a user-defined name. */
    filter_type: LaserFilterTypeName | (string & {});
}

export interface LaserFilterGainOptionLine extends BaseOptionLine<'pfiltergain'> {
    /** Gain of the peaking filter for laser audio effects. */
    gain: number;
}

export interface LaserFilterDelayOptionLine extends BaseOptionLine<'pfilterdelay'> {
    /** Timing delay in milliseconds of the peaking filter for laser audio effects. */
    delay: number;
}

export interface VideoOptionLine extends BaseOptionLine<'v'> {
    video: string;
}

export interface VideoOffsetOptionLine extends BaseOptionLine<'vo'> {
    offset: number;
}

export interface VersionOptionLine extends BaseOptionLine<'ver'> {
    version: string;
}

export interface InformationOptionLine extends BaseOptionLine<'information'> {
    information: string;
}

export type SlamSoundEffectName = 'up' | 'down' | 'swing' | 'mute';

export interface SlamSoundEffectOptionLine extends BaseOptionLine<'chokkakuse'> {
    sound_effect: SlamSoundEffectName;
}

export interface StopOptionLine extends BaseOptionLine<'stop'> {
    /** Duration of the pause. */
    duration: Pulse;
}

export type TiltTypeName =
    | 'normal'
    | 'bigger'
    | 'biggest'
    | 'keep_normal'
    | 'keep_bigger'
    | 'keep_biggest'
    | 'zero'
    | 'big' // DEPRECATED
    | 'keep'; // DEPRECATED

export interface TiltOptionLine extends BaseOptionLine<'tilt'> {
    tilt: TiltTypeName | number;
}

export interface ZoomTopOptionLine extends BaseOptionLine<'zoom_top'> {
    zoom: number;
}

export interface ZoomBottomOptionLine extends BaseOptionLine<'zoom_bottom'> {
    zoom: number;
}

export interface ZoomSideOptionLine extends BaseOptionLine<'zoom_side'> {
    zoom: number;
}

export interface CenterSplitOptionLine extends BaseOptionLine<'center_split'> {
    split: number;
}

export interface LaserRangeOptionLine extends BaseOptionLine<'laserrange_l'|'laserrange_r'> {
    fx_lane: 0|1;
    range: 1|2;
}

export interface FXOptionLine extends BaseOptionLine<'fx-l'|'fx-r'> {
    fx_lane: 0|1;
    effect_name: string;
    effect_params: Array<string|number>;
}

export interface LegacyFXParamOptionLine extends BaseOptionLine<'fx-l_param1'|'fx-r_param1'> {
    fx_lane: 0|1;
    param: number;
}

export interface FXSoundEffectOptionLine extends BaseOptionLine<'fx-l_se'|'fx-r_se'> {
    fx_lane: 0|1;
    effect_name: string;
    effect_volume?: number;
}

type KnownOptionLine =
    | TitleOptionLine
    | TitleImgOptionLine
    | ArtistOptionLine
    | ArtistImgOptionLine
    | EffectOptionLine
    | JacketOptionLine
    | IllustratorOptionLine
    | DifficultyOptionLine
    | LevelOptionLine
    | BPMOptionLine
    | StandardBPMOptionLine
    | BeatOptionLine
    | MusicOptionLine
    | MusicVolumeOptionLine
    | OffsetOptionLine
    | BackgroundOptionLine
    | LayerOptionLine
    | PreviewOffsetOptionLine
    | PreviewLengthOptionLine
    | TotalOptionLine
    | SlamVolumeOptionLine
    | SlamAutoVolumeOptionLine
    | LaserFilterTypeOptionLine
    | LaserFilterGainOptionLine
    | LaserFilterDelayOptionLine
    | VideoOptionLine
    | VideoOffsetOptionLine
    | VersionOptionLine
    | InformationOptionLine
    | SlamSoundEffectOptionLine
    | StopOptionLine
    | TiltOptionLine
    | ZoomTopOptionLine
    | ZoomBottomOptionLine
    | ZoomSideOptionLine
    | CenterSplitOptionLine
    | LaserRangeOptionLine
    | FXOptionLine
    | LegacyFXParamOptionLine
    | FXSoundEffectOptionLine;

export interface UnknownOptionLine extends BaseOptionLine<Exclude<string, KnownOptionLine['key']>> {
    unknown: true;
}

export type OptionLine = UnknownOptionLine | KnownOptionLine;

export function isUnknownOption(option: OptionLine): option is UnknownOptionLine {
    return !!((option as {unknown?: true}).unknown);
}

const DIFFICULTY_ARR = ['light', 'challenge', 'extended', 'infinite'];
const DIFFICULTY_MAP = Object.freeze(Object.fromEntries(DIFFICULTY_ARR.map((v, i) => [v, i])));

function parseIntWithDefault(s: string, default_value: number = 0): number {
    const parsed = parseInt(s, 10);
    return Number.isSafeInteger(parsed) ? parsed : default_value;
}

function parseFloatWithDefault(s: string, default_value: number = 0): number {
    const parsed = parseFloat(s);
    return Number.isFinite(parsed) ? parsed : default_value;
}

export function parseOption(key: string, value: string, is_body: boolean|null = null): OptionLine {
    const base = { type: 'option' as const, key, raw: value };

    switch (key) {
        case 'title':
            return { ...base, key, title: value };
        case 'title_img':
            return { ...base, key, title_img: value };
        case 'artist':
            return { ...base, key, artist: value };
        case 'artist_img':
            return { ...base, key, artist_img: value };
        case 'effect':
            return { ...base, key, effect: value };
        case 'jacket':
            return { ...base, key, jacket: value };
        case 'illustrator':
            return { ...base, key, illustrator: value };
        case 'difficulty':
            return { ...base, key, difficulty: DIFFICULTY_MAP[value] ?? 3 };
        case 'level': {
            return { ...base, key, level: parseIntWithDefault(value, 1) };
        }
        case 't': {
            if(value.includes('-')) return { ...base, key, bpm: value };

            const bpm = parseFloat(value);
            return { ...base, key, bpm: Number.isFinite(bpm) ? bpm : (is_body === true ? 120 : value) };
        }
        case 'to': {
            return { ...base, key, bpm: parseFloatWithDefault(value, 120) };
        }
        case 'beat': {
            const [beat_count, beat_unit] = value.split('/').map((s) => parseIntWithDefault(s, 4));
            return { ...base, key, time_sig: [beat_count, beat_unit] };
        }
        case 'm':
            return { ...base, key, music: value.split(';') };
        case 'mvol':
            return { ...base, key, volume: parseIntWithDefault(value, 100) };
        case 'o':
            return { ...base, key, offset: parseIntWithDefault(value, 0) };
        case 'bg':
            return { ...base, key, background: value.split(';') };
        case 'layer': {
            const [name, loop_time_ms_str, rotation_str] = value.split(';');
            const loop_time_ms = loop_time_ms_str ? parseIntWithDefault(loop_time_ms_str, 0) : (void 0);
            const rotation = rotation_str ? parseIntWithDefault(rotation_str, 0) as (0 | 1 | 2 | 3) : (void 0);
            return { ...base, key, name, loop_time_ms, rotation };
        }
        case 'po':
            return { ...base, key, offset: parseIntWithDefault(value, 0) };
        case 'plength':
            return { ...base, key, length: parseIntWithDefault(value, 0) };
        case 'total':
            return { ...base, key, total: parseIntWithDefault(value, 0) };
        case 'chokkakuvol':
            return { ...base, key, volume: parseIntWithDefault(value, 50) };
        case 'chokkakuautovol':
            return { ...base, key, enabled: parseIntWithDefault(value, 1) === 1 };
        case 'filtertype':
            return { ...base, key, filter_type: value };
        case 'pfiltergain':
            return { ...base, key, gain: parseIntWithDefault(value, 50) };
        case 'pfilterdelay':
            return { ...base, key, delay: parseIntWithDefault(value, 40) };
        case 'v':
            return { ...base, key, video: value };
        case 'vo':
            return { ...base, key, offset: parseIntWithDefault(value, 0) };
        case 'ver':
            return { ...base, key, version: value };
        case 'information':
            return { ...base, key, information: value };
        case 'chokkakuse':
            return { ...base, key, sound_effect: value as SlamSoundEffectName };
        case 'stop':
            return { ...base, key, duration: parsePulse(value, 0) };
        case 'tilt': {
            const tilt = parseFloat(value);
            return { ...base, key, tilt: Number.isNaN(tilt) ? value as TiltTypeName : tilt };
        }
        case 'zoom_top':
            return { ...base, key, zoom: parseIntWithDefault(value, 0) };
        case 'zoom_bottom':
            return { ...base, key, zoom: parseIntWithDefault(value, 0) };
        case 'zoom_side':
            return { ...base, key, zoom: parseIntWithDefault(value, 0) };
        case 'center_split':
            return { ...base, key, split: parseIntWithDefault(value, 0) };
        case 'laserrange_l':
        case 'laserrange_r': {
            const fx_lane = key === 'laserrange_l' ? 0 : 1;
            return { ...base, key, fx_lane, range: value.startsWith('2') ? 2 : 1 };
        }
        case 'fx-l':
        case 'fx-r': {
            const fx_lane = key === 'fx-l' ? 0 : 1;
            const [effect_name, ...effect_params_str] = value.split(';');
            const effect_params = effect_params_str.map(p => {
                const n = parseFloat(p);
                return Number.isNaN(n) ? p : n;
            });
            return { ...base, key, fx_lane, effect_name, effect_params };
        }
        case 'fx-l_param1':
        case 'fx-r_param1': {
            const fx_lane = key === 'fx-l_param1' ? 0 : 1;
            return { ...base, key, fx_lane, param: parseIntWithDefault(value, 0) };
        }
        case 'fx-l_se':
        case 'fx-r_se': {
            const fx_lane = key === 'fx-l_se' ? 0 : 1;
            const [effect_name, effect_volume_str] = value.split(';');
            const effect_volume = effect_volume_str ? parseIntWithDefault(effect_volume_str, 0) : (void 0);
            return { ...base, key, fx_lane, effect_name, effect_volume };
        }
        default:
            return { ...base, unknown: true };
    }
}


export function stringifyOption(option: OptionLine): string {
    if (option.raw != null) return `${option.key}=${option.raw}`;
    if (isUnknownOption(option)) return `${option.key}=`;

    let value: string;
    switch (option.key) {
        case 'title':
            value = option.title;
            break;
        case 'title_img':
            value = option.title_img;
            break;
        case 'artist':
            value = option.artist;
            break;
        case 'artist_img':
            value = option.artist_img;
            break;
        case 'effect':
            value = option.effect;
            break;
        case 'jacket':
            value = option.jacket;
            break;
        case 'illustrator':
            value = option.illustrator;
            break;
        case 'difficulty':
            value = DIFFICULTY_ARR[option.difficulty] ?? `${option.difficulty}`;
            break;
        case 'level':
            value = String(option.level);
            break;
        case 't':
            value = String(option.bpm);
            break;
        case 'to':
            value = String(option.bpm);
            break;
        case 'beat':
            value = option.time_sig.join('/');
            break;
        case 'm':
            value = option.music.join(';');
            break;
        case 'mvol':
            value = String(option.volume);
            break;
        case 'o':
            value = String(option.offset);
            break;
        case 'bg':
            value = option.background.join(';');
            break;
        case 'layer': {
            const parts: Array<string|number> = [option.name];
            if (option.loop_time_ms != null) {
                parts.push(option.loop_time_ms);
                if (option.rotation != null) {
                    parts.push(option.rotation);
                }
            } else if (option.rotation != null) {
                parts.push('', option.rotation);
            }
            value = parts.join(';');
            break;
        }
        case 'po':
            value = String(option.offset);
            break;
        case 'plength':
            value = String(option.length);
            break;
        case 'total':
            value = String(option.total);
            break;
        case 'chokkakuvol':
            value = String(option.volume);
            break;
        case 'chokkakuautovol':
            value = option.enabled ? '1' : '0';
            break;
        case 'filtertype':
            value = option.filter_type;
            break;
        case 'pfiltergain':
            value = String(option.gain);
            break;
        case 'pfilterdelay':
            value = String(option.delay);
            break;
        case 'v':
            value = option.video;
            break;
        case 'vo':
            value = String(option.offset);
            break;
        case 'ver':
            value = option.version;
            break;
        case 'information':
            value = option.information;
            break;
        case 'chokkakuse':
            value = option.sound_effect;
            break;
        case 'stop':
            value = stringifyPulse(option.duration);
            break;
        case 'tilt':
            value = String(option.tilt);
            break;
        case 'zoom_top':
        case 'zoom_bottom':
        case 'zoom_side':
            value = String(option.zoom);
            break;
        case 'center_split':
            value = String(option.split);
            break;
        case 'laserrange_l':
        case 'laserrange_r':
            value = `${option.range}x`;
            break;
        case 'fx-l':
        case 'fx-r':
            value = [option.effect_name, ...option.effect_params].join(';');
            break;
        case 'fx-l_param1':
        case 'fx-r_param1':
            value = String(option.param);
            break;
        case 'fx-l_se':
        case 'fx-r_se': {
            const parts = [option.effect_name];
            if (option.effect_volume != null) {
                parts.push(String(option.effect_volume));
            }
            value = parts.join(';');
            break;
        }
    }

    return `${option.key}=${value}`;
}