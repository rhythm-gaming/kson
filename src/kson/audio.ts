import { type } from 'arktype';
import { exportType } from "../util/type.js";

import { ByPulse, DefKeyValuePair, Double, Int, Uint } from "./common.js";

// BGM
export const BGMPreviewInfo = exportType(type({
    offset: Uint.default(0),
    duration: Uint.default(15000),
}));
export type BGMPreviewInfo = typeof BGMPreviewInfo.infer;

export const LegacyBGMInfo = exportType(type({
    fp_filenames: "string[]",
}));
export type LegacyBGMInfo = typeof LegacyBGMInfo.infer;

export const BGMInfo = exportType(type({
    "filename?": "string",
    vol: Double.default(1.0),
    offset: Int.default(0),
    "preview?": BGMPreviewInfo,
    "legacy?": LegacyBGMInfo,
}));
export type BGMInfo = typeof BGMInfo.infer;

// Key Sound
// Key Sound FX
export const KeySoundInvokeFX = exportType(type({
    vol: Double.default(1.0),
}));
export type KeySoundInvokeFX = typeof KeySoundInvokeFX.infer;

const KeySoundFXLaneInvocations = type([Uint.or(ByPulse(KeySoundInvokeFX))]).array();
const KeySoundFXInvocations = type([KeySoundFXLaneInvocations, KeySoundFXLaneInvocations]);

export const KeySoundInvokeListFX = exportType(type({
    "[string]": KeySoundFXInvocations,
}));
export type KeySoundInvokeListFX = typeof KeySoundInvokeListFX.infer;

export const KeySoundFXInfo = exportType(type({
    chip_event: KeySoundInvokeListFX,
}));
export type KeySoundFXInfo = typeof KeySoundFXInfo.infer;

// Key Sound Laser
export const KeySoundInvokeListLaser = exportType(type({
    "slam_up?": Uint.array(),
    "slam_down?": Uint.array(),
    "slam_swing?": Uint.array(),
    "slam_mute?": Uint.array(),
}));
export type KeySoundInvokeListLaser = typeof KeySoundInvokeListLaser.infer;

export const KeySoundLaserLegacyInfo = exportType(type({
    vol_auto: type("boolean").default(false),
}));
export type KeySoundLaserLegacyInfo = typeof KeySoundLaserLegacyInfo.infer;

export const KeySoundLaserInfo = exportType(type({
    vol: ByPulse(Double).array().default((): ByPulse<Double>[] => [[0, 0.5]]),
    "slam_event?": KeySoundInvokeListLaser,
    "legacy?": KeySoundLaserLegacyInfo,
}));
export type KeySoundLaserInfo = typeof KeySoundLaserInfo.infer;

// Key Sound (root)
export const KeySoundInfo = exportType(type({
    "fx?": KeySoundFXInfo,
    "laser?": KeySoundLaserInfo,
}));
export type KeySoundInfo = typeof KeySoundInfo.infer;

// Audio Effect
const StringDict = type("Record<string, string>");
const ByPulseString = ByPulse(type("string"));
const ByPulseStringDict = ByPulse(StringDict);

// Audio Effect FX
export const AudioEffectDef = exportType(type({
    type: "string",
    "v?": StringDict,
}));
export type AudioEffectDef = typeof AudioEffectDef.infer;

const ParamChange = type({
    "[string]": ByPulseString.array(),
});

const LongEventLane = type(Uint.or(ByPulseStringDict)).array();
const LongEvent = type([LongEventLane, LongEventLane]);

export const AudioEffectFXInfo = exportType(type({
    "def?": DefKeyValuePair(AudioEffectDef).array(),
    "param_change?": type({ "[string]": ParamChange }),
    "long_event?": type({ "[string]": LongEvent }),
}));
export type AudioEffectFXInfo = typeof AudioEffectFXInfo.infer;

// Audio Effect Laser
export const AudioEffectLaserInfo = exportType(type({
    "def?": type({ "[string]": AudioEffectDef }),
    "param_change?": type({ "[string]": ParamChange }),
    "pulse_event?": type({ "[string]": Uint.array() }),
    peaking_filter_delay: Uint.default(0),
}));
export type AudioEffectLaserInfo = typeof AudioEffectLaserInfo.infer;

// Audio Effect (root)
export const AudioEffectInfo = exportType(type({
    "fx?": AudioEffectFXInfo,
    "laser?": AudioEffectLaserInfo,
}));
export type AudioEffectInfo = typeof AudioEffectInfo.infer;

// Audio (root)
export const AudioInfo = exportType(type({
    "bgm?": BGMInfo,
    "key_sound?": KeySoundInfo,
    "audio_effect?": AudioEffectInfo,
}));
export type AudioInfo = typeof AudioInfo.infer;