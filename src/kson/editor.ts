import { type, type Type } from 'arktype';

import { ByPulse } from "./common.js";

export interface EditorInfo {
    app_name?: string;
    app_version?: string;
    comment?: ByPulse<string>[];
}

export const EditorInfo: Type<EditorInfo> = type({
    "app_name?": "string",
    "app_version?": "string",
    "comment?": ByPulse(type("string")).array(),
});