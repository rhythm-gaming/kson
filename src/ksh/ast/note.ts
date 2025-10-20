export const NoteType = Object.freeze({
    NONE: null,
    CHIP: false,
    LONG: true,
} as const);

/** chip/long = false/true */
export type NoteType = null|boolean;

export const LEGACY_FX = Object.freeze({
    'S': "Retrigger;8",
    'V': "Retrigger;12",
    'T': "Retrigger;16",
    'W': "Retrigger;24",
    'U': "Retrigger;32",
    'G': "Gate;4",
    'H': "Gate;8",
    'K': "Gate;12",
    'I': "Gate;16",
    'L': "Gate;24",
    'J': "Gate;32",
    'F': "Flanger",
    'P': "PitchShift",
    'B': "BitCrusher",
    'Q': "Phaser",
    'X': "Wobble;12",
    'A': "TapeStop",
    'D': "SideChain",
} as const);

export type LegacyFX = keyof typeof LEGACY_FX;

export function parseBT(bt: string): {bt: [NoteType, NoteType, NoteType, NoteType]} {
    const bt_arr = Array.from(bt).map((ch): NoteType => (ch === '0' ? null : ch === '2'));
    return { bt: bt_arr as [NoteType, NoteType, NoteType, NoteType] };
}

export function stringifyBT(bt: readonly [NoteType, NoteType, NoteType, NoteType]): string {
    return bt.map((note) => {
        switch(note) {
            case NoteType.NONE: return '0';
            case NoteType.CHIP: return '1';
            case NoteType.LONG: return '2';
        }
    }).join('');
}

export function parseFX(fx: string): {fx: [NoteType, NoteType], fx_legacy?: [LegacyFX|null, LegacyFX|null]} {
    const fx_arr: [NoteType, NoteType] = [null, null];
    const legacy: [LegacyFX|null, LegacyFX|null] = [null, null];
    let has_legacy = false;

    for(let i=0; i<2; ++i) {
        const ch = fx[i];
        switch(ch) {
            case '0': fx_arr[i] = null; break;
            case '2': fx_arr[i] = false; break;
            default: {
                fx_arr[i] = true;
                if(ch in LEGACY_FX) {
                    legacy[i] = ch as LegacyFX;
                    has_legacy = true;
                }
                break;
            }
        }
    }

    if(has_legacy)  return { fx: fx_arr, fx_legacy: legacy };
    else return { fx: fx_arr };
}

export function stringifyFX(
    fx: readonly [NoteType, NoteType],
    fx_legacy?: readonly [LegacyFX|null, LegacyFX|null],
): string {
    return fx.map((ch, i) => {
        switch(ch) {
            case NoteType.NONE: return '0';
            case NoteType.CHIP: return '2';
            case NoteType.LONG: return fx_legacy?.[i] ?? '1';
        }
    }).join('');
}