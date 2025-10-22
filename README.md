# @rhythm-gaming/kson

> [!WARNING]
> This library is currently in development.

This is a small TypeScript library for reading and writing KSH and KSON files, which are used by K-Shoot Mania and USC.

**NOTE:** This package is intended to replace [kshoot.js](https://github.com/rhythm-gaming/kshoot.js).

**NOTE:** Check out [kshoot-tools](https://github.com/rhythm-gaming/kshoot-tools) if you are looking for *a program or a tool* to do something with chart files.
This library can be used to create such tools, but is not a tool by itself.

## How to Use

The library can be installed by the following `npm` command.

```bash
npm install @rhythm-gaming/kson
```

Two pairs of functions, one for KSH, and one for KSON, are implemented by the library.

Both KSH and KSON charts are represented by a `KSON` object.

```ts
import {
  parseKSH, stringifyKSH,   // for reading/writing KSH
  parseKSON, stringifyKSON, // for reading/writing KSON
  type KSON,
  KSON_VERSION, // the version of the KSON specification this library implements
} from "@rhythm-gaming/kson";

// Open a KSH file.

import * as fs from "node:fs/promises";

const ksh_file = await fs.readFile("chart.ksh", 'utf-8');
const kson: KSON = parseKSH(ksh_file);

// Modify the chart's title.

kson.meta.title = "Good morning!";

// Save the file, both as KSH and KSON.

await fs.writeFile("chart.ksh", stringifyKSH(kson), 'utf-8');
await fs.writeFile("chart.kson", stringifyKSON(kson), 'utf-8');
```

Consult the KSON specification for how to navigate through a `KSON` object.

## Progress

### Format Support

- [ ] Reading KSH
- [X] Reading KSON
- [ ] Writing KSH
- [X] Writing KSON

#### Reading KSH Progression

- [x] Header parsing
    - [x] `title`, `artist`, `effect`, `illustrator`
    - [x] `title_img`, `artist_img`, `jacket`
    - [x] `difficulty`, `level`
    - [x] `t`, `beat`
    - [x] `o`, `m`, `mvol`
    - [x] `total`
    - [x] `po`, `plength`
    - [x] `bg`, `layer`, `v`, `vo`
    - [x] `chokkakuvol`, `chokkakuautovol`, `pfilterdelay`
    - [x] `filtertype`, `pfiltergain`
    - [x] `ver`, `information`
- [ ] Body parsing
    - [ ] Chart lines
        - [x] BT notes (chip, long)
        - [x] FX notes (chip, long)
        - [ ] FX notes (legacy effects)
        - [x] Laser notes (linear, slam)
        - [ ] Laser notes (spin)
    - [ ] Option lines
        - [x] `t`, `beat`
        - [x] `chokkakuvol`
        - [x] `laserrange_l`, `laserrange_r`
        - [x] `stop`
        - [ ] `tilt`
        - [ ] `zoom_*`, `center_split`
        - [ ] `fx-*`
        - [x] `filtertype`, `pfiltergain`
- [ ] Footer parsing
    - [ ] `#define_fx`
    - [ ] `#define_filter`

## Helpful Resources

- [KSH Chart File Format Specification](https://github.com/m4saka/ksm-chart-format-spec/blob/master/ksh_format.md)
- [KSON Format Specification](https://github.com/m4saka/ksm-chart-format-spec/blob/master/kson_format.md)

## Development

This project uses [pnpm](https://pnpm.io/) for package management.

- `pnpm build` – compile TypeScript from `src/` into `dist/`.
  - `pnpm build:watch` – recompile on every file change.
- `pnpm test` – run unit tests from `src/**/*.spec.ts`.
  - Don't forget to run `pnpm build` before running tests!
- `pnpm lint` – run ESLint on the source code.
- `pnpm clean` – remove the `dist/` directory.

## License

[MIT](./LICENSE)
