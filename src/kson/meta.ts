import { type, type Type } from 'arktype';

import { checkIsRecord, Double, Uint } from "./common.js";

export interface MetaInfo {
    title: string;
    title_translit?: string;
    title_img_filename?: string;
    
    artist: string;
    artist_translit?: string;
    artist_img_filename?: string;

    chart_author: string;
    difficulty: Uint|string;
    level: Uint;

    disp_bpm: string;
    std_bpm?: Double;

    jacket_filename?: string;
    jacket_author?: string;
    icon_filename?: string;
    information?: string;
}

export const MetaInfo: Type<MetaInfo> = type({
    title: "string",
    title_translit: "string?",
    title_img_filename: "string?",

    artist: "string",
    artist_translit: "string?",
    artist_img_filename: "string?",

    chart_author: "string",
    difficulty: Uint.or("string"),
    level: Uint,

    disp_bpm: "string",
    std_bpm: Double.optional(),

    jacket_filename: "string?",
    jacket_author: "string?",
    icon_filename: "string?",
    information: "string?",
}).narrow(checkIsRecord);