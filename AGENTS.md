# Repository-Specific Instructions

## Overview

### Summary

- Domain: Rhythm Game Programming
- Language: TypeScript
- This Project: An NPM package `@rhythm-gaming/kson`.
- Purpose: Reading and Writing KSH and KSON Files

### Important Terms

- Sound Voltex: Rhythm Game developed by Konami, using 6 buttons (4 are 'BT', 2 are 'FX') and 2 knobs (left and right).
- K-Shoot Mania: A simulator for Sound Voltex created by @m4saka. "KSM" for short.
- KSH (`.ksh`): Text-based legacy chart format for KSM.
- KSON (`.kson`): JSON-based new chart format for KSM.

### Development

This project uses pnpm.

- `pnpm build`: Compiles TypeScript code from `src/` into `dist/`.
- `pnpm test`: Run unit tests from `src/**/*.spec.ts`.

### File Structure

- `.continue/rules/overview.md`: This file.
- `spec/`: Specifications for KSH and KSON.
  - `ksh.md`, `kson.md`: KSH/KSON format specification.
- `src/`: Source code.
  - `ksh/`: Reading/Writing KSH, and converting it to/from KSON.
    - `ast/`: AST representation of KSH file.
    - `converter/`: For converting KSH to/from KSON.
    - `test/`: Tests for KSH functionalities. Each file corresponds to one test chart.
  - `kson/`: Reading/Writing KSON
    - `schema/`: ArkType schema for KSON 
- `test/chart/`: Test charts.

## Coding Style

### TypeScript

- Using `any` is strictly forbidden.
- Use `as` only when it's absolutely necessary.

## Format Representation

### KSH

- Read `/spec/ksh.md` before working on a KSH feature.
- `src/ksh/ast/pulse.ts` exports the following:
  - `type Pulse = number`: Unlike spec, `Pulse` is always KSON-based (960 per whole note).
    - `parsePulse` and `stringifyPulse` automatically converts from/to KSH-based pulses.
  - `const PULSES_PER_WHOLE: Pulse`: `960`, not `192` as noted above.
  - `function parsePulse(s: string, default_value: Pulse): Pulse`
  - `function parsePulse(s: string, default_value?: null): Pulse|null`
  - `function stringifyPulse(p: Pulse): string`

### KSON

- Read `/spec/kson.md` before working on a KSON feature.
- ArkType is used for specifying a schema.
- Some normalizations are performed in schema, so technically (inferred) schema types are narrower than spec types.
  - Most significantly, default values are being filled.
  - Input types still should conform to the spec.

## Format Conversion

### KSH to KSON

- The `stop` option would be converted into KSON via scroll speed:
  - At the start of `stop`, scroll speed is decreased by 1.
  - At the end of `stop`, scroll speed is increased by 1`.
  - Note that this would give negative scroll speeds on overlapping stop intervals, which is intended.

### KSON to KSH

- Scroll speeds: Allow only when it can be represented by `stop`.
- Graph curves: Ignore all curve parameters for now. 

## Unit Tests

- This project uses mocha and chai.
- In general, `foo.ts` is tested at `foo.spec.ts` (exception: per-chart tests for KSH under `/src/ksh/test/`).
- Take existing `*.spec.ts` files as references before creating a new test file.
- Prefer using `strictEqual` and `deepStrictEqual` over `equal` and `deepEqual`.