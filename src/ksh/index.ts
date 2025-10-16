export type { KSH } from "./ast/index.js";

import { KSON } from "../kson";
import { type KSH, parseKSH as parseToAST, stringifyKSH as stringifyAST } from "./ast/index.js";

/**
 * Parse a KSH file into a KSON object.
 * 
 * To parse into a KSH object (closer to the `.ksh` format), use `parseKSH(ksh, true)` instead.
 * 
 * @param ksh 
 * @param to_ast 
 */
export function parseKSH(ksh: string, to_ast?: false): KSON;

/**
 * Parse a KSH file into a KSH object.
 * 
 * To parse into a KSON object (easier to work with semantically), use `parseKSH(ksh)` instead.
 * 
 * @param ksh 
 * @param to_ast 
 */
export function parseKSH(ksh: string, to_ast: true): KSH;

export function parseKSH(ksh: string, to_ast?: boolean): KSON|KSH {
    const ast = parseToAST(ksh);
    if(to_ast) return ast;

    throw new Error("Not yet implemented!");
}

function isKSH(value: KSON|KSH): value is KSH {
    if(Object.hasOwn(value, 'version')) return false;
    if(Object.hasOwn(value, 'meta')) return false;
    if(Object.hasOwn(value, 'beat')) return false;

    return true;
}

export function stringifyKSH(chart: KSON|KSH): string {
    if(!isKSH(chart)) throw new Error("Not yet implemented!");

    return stringifyAST(chart);
}