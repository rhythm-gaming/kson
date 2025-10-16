import { KSH } from "../ast/index.js";
import { KSON } from "../../kson/index.js";

export class KSON2KSHConverter {
    // eslint-disable-next-line no-unused-private-class-members
    #kson: KSON;

    constructor(kson: KSON) {
        this.#kson = kson;
    }

    toKSH() : KSH {
        throw new Error("Not implemented");
    }
}