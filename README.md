# @rhythm-gaming/kson

> [!CAUTION]
> This library is currently in development.

This is a TypeScript library for reading and writing KSH and KSON files of K-Shoot Mania.
This library is focused on being a minimal yet easy-to-use library with minimal dependency.

**NOTE:** This package is intended to replace [kshoot.js](https://github.com/rhythm-gaming/kshoot.js), which will be modified to be a thin wrapper around this library.

**NOTE:** Check out [kshoot-tools](https://github.com/rhythm-gaming/kshoot-tools) if you are looking for *a program or a tool* to do something with chart files.
This library can be used to create such tools, but is not a tool by itself.

## Usage Examples

## Progress

### Format Support

- [ ] Reading KSH
- [ ] Reading KSON
- [ ] Writing KSH
- [ ] Writing KSON

## Chart File Specs

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
