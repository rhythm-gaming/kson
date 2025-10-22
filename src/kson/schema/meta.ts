import { type } from 'arktype';
import { exportType } from "../../util/type.js";

import { checkIsRecord, Double, Uint } from "./common.js";

export const MetaInfo = exportType(type({
    title: "string",
    title_translit: "string?",
    title_img_filename: "string?",
    
    artist: "string",
    artist_translit: "string?",
    artist_img_filename: "string?",

    chart_author: "string",
    difficulty: Uint.or("string"),
    level: Uint, // omit range check

    disp_bpm: "string", // omit character check
    std_bpm: Double.optional(),

    jacket_filename: "string?",
    jacket_author: "string?",
    icon_filename: "string?",
    information: "string?",
}).narrow(checkIsRecord));
export type MetaInfo = typeof MetaInfo.infer;

export function createMetaInfo(): MetaInfo {
    return {
        title: "",
        artist: "",
        chart_author: "",
        
        difficulty: 0,
        level: 1,

        disp_bpm: "120",
    };
}