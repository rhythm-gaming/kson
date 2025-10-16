import { BarLine, ChartLine, CommentLine, DefinitionLine, HeaderContent, KSH, KSHLine, Measure, MeasureContent, UnknownLine } from "./ast.js";

const CHART_LINE_REGEX = /^([012]{4})\|(.{2})\|([-:0-9A-Za-o]{2})(?:([@S][<>()])(\d+))?$/;
const OPTION_LINE_REGEX = /^([^=]+)=(.*)$/;
const DEFINITION_LINE_REGEX = /^#define_(\S+)\s+(\S+)\s+(.*)$/;

/**
 * Parses a single line of a KSH file.
 * @param line The line to parse.
 * @returns A KSHLine object, or `null` if the line is empty.
 */
function parseLine(line: string): KSHLine|null {
    line = line.trim();
    if (line === '') {
        return null;
    }

    if (line.startsWith('//')) {
        return { type: 'comment', comment: line.substring(2) } satisfies CommentLine;
    }

    if (line === '--') {
        return { type: 'bar' } satisfies BarLine;
    }

    const def_match = line.match(DEFINITION_LINE_REGEX);
    if(def_match) {
        const [, definition_type, name, value] = def_match;
        return { type: 'definition', definition_type, name, value };
    }

    const opt_match = line.match(OPTION_LINE_REGEX);
    if (opt_match) {
        const [, key, value] = opt_match;
        return { type: 'option', key, value };
    }

    const chart_match = line.match(CHART_LINE_REGEX);
    if (chart_match) {
        const [, bt, fx, laser, spin_type, spin_duration_str] = chart_match;

        const chart_line: ChartLine = {
            type: 'chart',
            bt,
            fx,
            laser,
        };

        if (spin_type && spin_duration_str) {
            let spin_duration = parseInt(spin_duration_str, 10);
            if(!Number.isFinite(spin_duration)) spin_duration = 0;

            chart_line.spin = {
                type: spin_type,
                duration: spin_duration,
            };
        }

        return chart_line;
    }

    return { type: 'unknown', line } satisfies UnknownLine;
}

/**
 * Parses a KSH file content into an Abstract Syntax Tree (AST).
 * 
 * While this function can handle BOM prefix, it is recommended to remove it before calling this function.
 * 
 * @param ksh The KSH file content as a string.
 * @returns The KSHAst representing the file.
 */
export function parseKSH(ksh: string): KSH {
    const lines = ksh.split(/\r?\n/);
    
    const header: HeaderContent[] = [];
    const body: Measure[] = [];
    const footer: DefinitionLine[] = [];

    let curr_line_no = 0;

    header_loop: for (; curr_line_no < lines.length; ++curr_line_no) {
        let line = lines[curr_line_no];

        // Strip BOM if present.
        if(curr_line_no === 0 && line.startsWith("\uFFFE")) {
            line = line.slice(1);
        }

        const parsed = parseLine(line);
        if(!parsed) continue;

        switch(parsed.type) {
            case 'bar':
                break header_loop;
            case 'definition':
                footer.push(parsed);
                continue header_loop;
            case 'option':
            case 'comment':
                header.push(parsed);
                break;
            default:
                header.push({type: 'unknown', line});
        }
    }

    if(curr_line_no >= lines.length) {
        return { header, body, footer };
    }
    
    let measure_start_line_no = curr_line_no;
    let curr_measure_lines: MeasureContent[] = [];

    for (curr_line_no = curr_line_no + 1; curr_line_no < lines.length; ++curr_line_no) {
        const parsed = parseLine(lines[curr_line_no]);
        if(!parsed) continue;

        switch(parsed.type) {
            case 'bar':
                body.push({ line_no: measure_start_line_no, lines: curr_measure_lines });
                measure_start_line_no = curr_line_no;
                curr_measure_lines = [];
                break;
            case 'definition':
                footer.push(parsed);
                break;
            default:
                curr_measure_lines.push(parsed);
                break;
        }
    }
    
    if(curr_measure_lines.length > 0) {
        body.push({ line_no: measure_start_line_no, lines: curr_measure_lines });
    }

    return { header, body, footer };
}