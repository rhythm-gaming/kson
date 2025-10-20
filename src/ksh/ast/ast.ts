import { LaserInd } from "./laser.js";
import { LegacyFX, NoteType } from "./note.js";
import { SpinInfo } from "./spin.js";

/** A key-value pair from an option line (e.g., `title=...`). */
export interface OptionLine {
    readonly type: 'option';
    key: string;
    value: string;
}

/** A chart line with BT, FX, and laser notes. */
export interface ChartLine {
    readonly type: 'chart';
    bt: [NoteType, NoteType, NoteType, NoteType];
    fx: [NoteType, NoteType];
    fx_legacy?: [LegacyFX|null, LegacyFX|null];

    laser: [LaserInd|null, LaserInd|null];
    spin?: SpinInfo;
}

/** A bar line separator (`--`). */
export interface BarLine {
    readonly type: 'bar';
}

/** A definition line (e.g., `#define_fx ...`). */
export interface DefinitionLine {
    readonly type: 'definition';
    definition_type: string;
    name: string;
    value: string;
}

/** A comment line (`//...`). */
export interface CommentLine {
    readonly type: 'comment';
    comment: string;
}

/** An unknown line. */
export interface UnknownLine {
    readonly type: 'unknown';
    line: string;
}

export type HeaderContent = OptionLine | CommentLine | UnknownLine;
export type MeasureContent = OptionLine | ChartLine | CommentLine | UnknownLine;
export type KSHLine = OptionLine | ChartLine | BarLine | DefinitionLine | CommentLine | UnknownLine;

/** Represents a measure, containing a list of lines between two bar lines. */
export interface Measure {
    /** 0-indexed line number of the bar line just before the measure. */
    line_no: number;
    lines: MeasureContent[];
}

/** The Abstract Syntax Tree for a KSH file. */
export interface KSH {
    /** Lines before the first bar line. */
    header: HeaderContent[];

    /** Measures in the chart body. */
    body: Measure[];

    /** Definition lines, typically at the end of the file. */
    footer: DefinitionLine[];
}