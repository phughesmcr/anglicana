# Anglicana

Repository for **[@phughesmcr/anglicana](https://jsr.io/@phughesmcr/anglicana)** — a TypeScript library for Church of
England calendar calculations and liturgical data (Common Worship, Temporal API). Library sources live under
`packages/calendar/` (with per-package `test/`, `examples/`, `docs/`, and `dist/`); a single root [`deno.json`](deno.json)
configures the project and JSR `exports`.

**Documentation, usage, and license text** for the calendar package live in
[packages/calendar/README.md](packages/calendar/README.md). Implementation and tests are under
`packages/calendar/src/` and `packages/calendar/test/`.

From the repository root:

```bash
deno task check   # format, lint, typecheck, doc lint
deno task test
deno task build   # check + calendar:bundle
```
