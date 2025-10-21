import { KSH, KSHLine } from "./ast.js";
import { stringifyLaser } from "./laser.js";
import { stringifyBT, stringifyFX } from "./note.js";
import { stringifyOption } from "./option.js";
import { stringifySpinInfo } from "./spin.js";

/**
 * Stringifies a line from a KSH AST.
 * @param line The AST line object.
 * @returns The string representation of the line.
 */
export function stringifyLine(line: KSHLine): string {
    switch(line.type) {
        case 'option':
            return stringifyOption(line);
        case 'chart': {
            const bt = stringifyBT(line.bt);
            const fx = stringifyFX(line.fx, line.fx_legacy);
            const laser = stringifyLaser(line.laser);
            let result = `${bt}|${fx}|${laser}`;
            if (line.spin) {
                result += stringifySpinInfo(line.spin);
            }
            return result;
        }
        case 'bar':
            return "--";
        case 'definition':
            return `#define_${line.definition_type} ${line.name} ${line.value}`;
        case 'comment':
            return `//${line.comment}`;
        case 'unknown':
            return line.line;
    }
}

/**
 * Stringifies a KSH AST back into a KSH file string.
 * 
 * This function normalizes the KSH file by placing all definition lines at the end.
 * It also ensures the file is valid by having at least one bar line if not empty.
 * 
 * @param ksh The KSH AST.
 * @returns The string content of the KSH file.
 */
export function stringifyKSH(ksh: KSH): string {
    const is_empty = ksh.header.length === 0 && ksh.body.length === 0 && ksh.footer.length === 0;
    if (is_empty) {
        return "";
    }

    const output: string[] = [];

    for (const line of ksh.header) {
        output.push(stringifyLine(line));
    }

    output.push('--');

    for (const measure of ksh.body) {
        for (const line of measure.lines) {
            output.push(stringifyLine(line));
        }
        output.push('--');
    }

    for (const line of ksh.footer) {
        output.push(stringifyLine(line));
    }

    return output.join('\n');
}