import { type } from 'arktype';
import { exportType } from "../util/type.js";

import { ByPulse } from "./common.js";

export const EditorInfo = exportType(type({
    "app_name?": "string",
    "app_version?": "string",
    "comment?": ByPulse(type("string")).array(),
}));
export type EditorInfo = typeof EditorInfo.infer;