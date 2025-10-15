import { KSON } from "../kson";

export function parseKSH(): KSON {
    throw new Error("Not yet implemented!");
}

export function stringifyKSH(kson: KSON): never {
    if(kson) throw new Error("Not yet implemented!");
    else return kson as never;
}