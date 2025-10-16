import { KSH } from "../ast/index.js";
import { KSON } from "../../kson/index.js";

import { KSH2KSONConverter } from "./ksh2kson.js";
import { KSON2KSHConverter } from "./kson2ksh.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ksh2kson(ksh: KSH): KSON {
    return (new KSH2KSONConverter(ksh)).toKSON();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function kson2ksh(kson: KSON): KSH {
    return (new KSON2KSHConverter(kson)).toKSH();
}