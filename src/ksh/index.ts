export type { KSH } from "./ast/index.js";

import { KSON } from "../kson";
import { type KSH, parseKSH as parseToAST, stringifyKSH as stringifyAST } from "./ast/index.js";
import { ksh2kson, kson2ksh } from "./converter/index.js";

/**
 * Parse a KSH source into a KSON object.
 * 
 * To parse into a KSH object (closer to the `.ksh` format), use `parseKSH(ksh_src, true)` instead.
 * 
 * @param ksh_src 
 * @param to_ksh 
 */
export function parseKSH(ksh_src: string, to_ksh?: false): KSON;

/**
 * Parse a KSH source into a KSH object.
 * 
 * To parse into a KSON object (easier to work with semantically), use `parseKSH(ksh_src)` instead.
 * 
 * @param ksh_src 
 * @param to_ksh 
 */
export function parseKSH(ksh_src: string, to_ksh: true): KSH;

export function parseKSH(ksh_src: string, to_ksh?: boolean): KSON|KSH {
    const ksh = parseToAST(ksh_src);
    if(to_ksh) return ksh;
    
    return ksh2kson(ksh);
}

function isKSH(value: KSON|KSH): value is KSH {
    if(Object.hasOwn(value, 'version')) return false;
    if(Object.hasOwn(value, 'meta')) return false;
    if(Object.hasOwn(value, 'beat')) return false;

    return true;
}

export function stringifyKSH(chart: KSON|KSH): string {
    if(!isKSH(chart)) chart = kson2ksh(chart);

    return stringifyAST(chart);
}