import { KSH, OptionLine } from "../ast/index.js";
import { BeatInfo, GaugeInfo, GraphSectionPoint, KSON, KSON_VERSION, LaserSection, MetaInfo, TimeSig } from "../../kson/index.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

function getHeaderMap(ksh: KSH): Map<string, string> {
    return new Map(
        ksh.header.filter((x): x is OptionLine => x.type === 'option').map(({key, value}) => [key, value])
    );
}

const DIFFICULTY_LOOKUP: Record<string, 0|1|2|3|undefined> = {
    'light': 0,
    'challenge': 1,
    'extended': 2,
    'infinite': 3,
};

export class KSH2KSONConverter {
    // eslint-disable-next-line no-unused-private-class-members
    #ksh: KSH;
    #header_map: Map<string, string>;
    
    #time_sig_by_measure: TimeSig[] = [];
    
    #measure_pulses: number[] = [];
    #measure_start_pulses: number[] = [];

    constructor(ksh: KSH) {
        this.#ksh = ksh;
        this.#header_map = getHeaderMap(ksh);
        this.#preprocessTiming();
    }

    #preprocessTiming() {
        let curr_time_sig = parseTimeSig(this.#header_map.get('beat') ?? "4/4");
        this.#time_sig_by_measure = [];

        for(const measure of this.#ksh.body) {
            for(let i=measure.lines.length; i-->0;) {
                const line = measure.lines[i];
                if(line.type === 'option' && line.key === 'beat') {
                    curr_time_sig = parseTimeSig(line.value);
                    break;
                }
            }

            this.#time_sig_by_measure.push(curr_time_sig);
        }
        
        this.#measure_pulses = this.#time_sig_by_measure.map(([n, d]) => {
            n *= 192;
            if(n%d !== 0) {
                throw new Error(`Invalid time signature ${n}/${d}`);
            }
            return n / d;
        });
        
        this.#measure_start_pulses = [0];
        for (let i = 0; i < this.#measure_pulses.length; ++i) {
            this.#measure_start_pulses.push(this.#measure_start_pulses[i] + this.#measure_pulses[i]);
        }

    }

    toKSON() : KSON {
        const kson: KSON = {
            version: KSON_VERSION,
            meta: this.#getKSONMeta(),
            beat: this.#getKSONBeat(),
        };

        const gauge = this.#getKSONGauge();
        if(gauge) kson.gauge = gauge;

        return kson;
    }

    #getKSONMeta(): MetaInfo {
        const difficulty = DIFFICULTY_LOOKUP[this.#header_map.get('difficulty') ?? 'light'] ?? 3;

        const meta: MetaInfo = {
            title: this.#header_map.get('title') ?? '',
            artist: this.#header_map.get('artist') ?? '',
            chart_author: this.#header_map.get('effect') ?? '',
            difficulty,
            level: parseInt(this.#header_map.get('level') ?? '1', 10),
            disp_bpm: this.#header_map.get('t') ?? '120',
        };

        const title_img = this.#header_map.get('title_img');
        if (title_img) meta.title_img_filename = title_img;

        const artist_img = this.#header_map.get('artist_img');
        if (artist_img) meta.artist_img_filename = artist_img;

        const jacket = this.#header_map.get('jacket');
        if (jacket) meta.jacket_filename = jacket;

        const illustrator = this.#header_map.get('illustrator');
        if (illustrator) meta.jacket_author = illustrator;

        const information = this.#header_map.get('information');
        if (information) meta.information = information;

        const std_bpm_str = this.#header_map.get('to');
        if (std_bpm_str) {
            const std_bpm = parseFloat(std_bpm_str);
            if (Number.isFinite(std_bpm) && std_bpm > 0) {
                meta.std_bpm = std_bpm;
            }
        }

        return meta;
    }

    #getKSONBeat(): BeatInfo {
        throw new Error("Not yet implemented!");
    }
    
    #getKSONGauge(): GaugeInfo | null {
        const total_str = this.#header_map.get('total');
        if(!total_str) return null;

        const total = parseInt(total_str, 10);
        if(!Number.isSafeInteger(total) || total === 0) return null;

        return { total };
    }
}