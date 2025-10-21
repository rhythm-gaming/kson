---
name: Testing
---

# Testing

- This project uses mocha and chai.
- In general, `foo.ts` is tested at `foo.spec.ts` (exception: per-chart tests for KSH under `/src/ksh/test/`).
- Check existing `*.spec.ts` file before creating a new test file.
- Prefer using `strictEqual` and `deepStrictEqual` over `equal` and `deepEqual`.