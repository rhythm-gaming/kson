# @rhythm-gaming/kson

> [!WARNING]
> This library is currently in development.

This is a small TypeScript library for reading and writing KSH and KSON files, which are used by K-Shoot Mania and USC.

**NOTE:** This package is intended to replace [kshoot.js](https://github.com/rhythm-gaming/kshoot.js).

**NOTE:** Check out [kshoot-tools](https://github.com/rhythm-gaming/kshoot-tools) if you are looking for *a program or a tool* to do something with chart files.
This library can be used to create such tools, but is not a tool by itself.

## How to Use

The library can be installed via:

```bash
npm install @rhythm-gaming/kson
```

Both KSH and KSON charts are internally represented as a `KSON` object. Consult [the KSON specification](https://github.com/kshootmania/ksm-chart-format/blob/master/kson_format.md) for how to navigate through a `KSON` object.

### KSH reading/writing

```ts
import * as fs from "node:fs/promises";
import {
  parseKSH,     // KSH source to KSON or KSH
  stringifyKSH, // KSON or KSH to KSH source
  type KSON,
} from "@rhythm-gaming/kson";

const ksh_text = await fs.readFile("chart.ksh", "utf-8");
const kson: KSON = parseKSH(ksh_text);

kson.meta.title = "Hello, world!";

const new_ksh_text = stringifyKSH(kson);
await fs.writeFile("new_chart.ksh", new_ksh_text, "utf-8");
```

Note that, by default, `parseKSH` will convert the KSH file to KSON representation.

When the second argument to `parseKSH` is `true`, the library will not convert the KSH file to KSON representation, and will return an AST for the original KSH file.

### KSON reading/writing

```ts
import * as fs from "node:fs/promises";
import {
  parseKSON,     // KSON source or non-normalized KSON to normalized KSON
  stringifyKSON, // KSON to KSON source
  createKSON,    // Create a new empty KSON object
  type KSON,
} from "@rhythm-gaming/kson";

// Open and read a KSON file.

const kson_text = await fs.readFile("chart.kson", "utf-8");
const kson: KSON = parseKSON(kson_text);

kson.meta.title = "Hello, world!";
kson.meta.artist = "John Doe";

const new_kson_text = stringifyKSON(kson);
await fs.writeFile("new_chart.kson", new_kson_text, "utf-8");
```

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
