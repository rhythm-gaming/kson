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

## Comments

### KSH

- Read `/spec/ksh.md` before working on a KSH feature.
- `src/ksh/ast/pulse.ts` exports the following:
  - `type Pulse`
  - `const PULSES_PER_WHOLE: Pulse`, which is 960 (unlike spec, where a whole note is 192 pulses).
  - `function parsePulse(s: string, default_value: Pulse): Pulse`
    - Multiplication by 5 is automatically performed.
  - `function parsePulse(s: string, default_value?: null): Pulse|null`
  - `function stringifyPulse(p: Pulse): string`
      - Division by 5 is automatically performed.
- The `stop` option would be converted into KSON via scroll speed:
  - At the start of `stop`, scroll speed is decreased by 1.
  - At the end of `stop`, scroll speed is increased by 1`.
  - Note that this would give negative scroll speeds on overlapping stop intervals, which is intended.

### KSON

- Read `/spec/kson.md` before working on a KSON feature.
- Some normalization is performed in schema. Most significantly, many fields with default values will be automatically filled.

### Writing Tests

- This project uses mocha and chai.
- In general, `foo.ts` is tested at `foo.spec.ts` (exception: per-chart tests for KSH under `/src/ksh/test/`).
- Check existing `*.spec.ts` file before creating a new test file.
- Prefer using `strictEqual` and `deepStrictEqual` over `equal` and `deepEqual`.