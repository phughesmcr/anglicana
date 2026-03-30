# Anglicana

TypeScript library for **Church of England liturgical calendars**: Common Worship rules, moveable and fixed feasts, transfers, lectionary helpers, and queries—all built on the **[Temporal](https://tc39.es/proposal-temporal/docs/)** date types.

Published as **[`@phughesmcr/anglicana` on JSR](https://jsr.io/@phughesmcr/anglicana)**. This repository is the source of truth; pushes to `main` run CI and publish the package.

## What you get

- **Full calendar generation** for a church year (`generateLiturgicalCalendar`), with **canonical** vs **pastoral** modes and fine-grained transfer options.
- **Per-date utilities**: Easter, Advent, principal feasts and holy days, seasons, Sunday/weekday lectionary markers, and more (see package exports).
- **Efficient lookups**: build once, then group or filter by date instead of regenerating for every query.
- **Local celebrations**: optional patronal, dedication, and harvest-style events with transfer behaviour aligned to the rest of the model.

The implementation lives under [`packages/calendar/`](packages/calendar/); the root [`deno.json`](deno.json) defines JSR [`exports`](https://jsr.io/docs/package-configuration#exports), tasks, and tooling for the whole repo.

## Install

Use JSR with your runtime’s usual workflow:

```bash
# Deno
deno add jsr:@phughesmcr/anglicana

# Node (via jsr CLI)
npx jsr add @phughesmcr/anglicana

# Bun
bunx jsr add @phughesmcr/anglicana
```

**Temporal is required** at runtime (built into Deno 2.7+; in browsers and many Node setups you will need a polyfill). See [Usage, browser bundle, and React notes](packages/calendar/readme.md#usage) in the package readme.

## Documentation

- **Usage, API surface, canonical modes, local events, and copyright notices for liturgical texts** → [`packages/calendar/readme.md`](packages/calendar/readme.md)
- **Browseable API on JSR** → [jsr.io/@phughesmcr/anglicana](https://jsr.io/@phughesmcr/anglicana)
- **Local type/docs exploration**: `deno doc ./packages/calendar/mod.ts` (or open the same path in your editor)

## Quick start

```ts
import {
  generateLiturgicalCalendar,
  getEasterSunday,
  liturgicalYearFromChurchYear,
  groupCalendarEventsByDate,
} from "@phughesmcr/anglicana/calendar";

const churchYear = 2026;
const ly = liturgicalYearFromChurchYear(churchYear);
const byDay = groupCalendarEventsByDate(
  generateLiturgicalCalendar(ly, { canonicalMode: "pastoral" }),
);

console.log(getEasterSunday(churchYear).toString());
console.log(byDay.get("2025-12-25") ?? []);
```

Default import re-exports the calendar namespace:

```ts
import anglicana from "@phughesmcr/anglicana";
// anglicana.calendar — same module as @phughesmcr/anglicana/calendar
```

## Repository layout

| Path | Role |
|------|------|
| [`mod.ts`](mod.ts) | Package root entry; default export aggregates submodules. |
| [`packages/calendar/mod.ts`](packages/calendar/mod.ts) | Calendar submodule entry (`@phughesmcr/anglicana/calendar`). |
| [`packages/calendar/src/`](packages/calendar/src/) | Source: generation, transfers, temporal helpers, JSON calendar data. |
| [`packages/calendar/test/`](packages/calendar/test/) | Tests (`deno test` from repo root). |
| [`packages/calendar/examples/`](packages/calendar/examples/) | Smoke scripts and browser demo assets. |

Generated or local-only paths (typically gitignored): `packages/calendar/dist/` (browser bundle), `packages/calendar/docs/`, `scratch/`.

## Development

**Requirements:** [Deno](https://deno.com/) **2.7+** (Temporal without unstable flags; matches [CI](.github/workflows/ci.yml)).

Clone the repo, then from the **repository root**:

| Task | Command |
|------|---------|
| Format (check), lint, typecheck | `deno task check` |
| Tests | `deno task test` |
| Full build (check + minified browser bundle) | `deno task build` |
| Browser bundle only | `deno task calendar:bundle` → `packages/calendar/dist/anglicana_calendar.min.js` |
| Local browser demo server | `deno task calendar:browser-demo` |

Optional git hooks (pre-commit runs check, format, and tests):

```bash
deno task contribute
```

After `deno task build`, try the static browser demo with `deno task calendar:browser-demo` (serves `packages/calendar/` on port 8765).

## CI and publishing

- **[`.github/workflows/ci.yml`](.github/workflows/ci.yml)** — on pushes and PRs to `main`: `deno task check` and `deno task test` (Deno 2.7.0).
- **[`.github/workflows/publish.yml`](.github/workflows/publish.yml)** — on push to `main`, publishes with `npx jsr publish` (OIDC to JSR).

## Contributing

Issues and pull requests are welcome. Please run `deno task check` and `deno task test` before submitting changes, add or update tests for behaviour you touch, and follow [Deno’s style guide](https://docs.deno.com/runtime/contributing/style_guide/) where it fits this codebase.

## Disclaimer

Anglicana is **not** affiliated with the Church of England or any official body. It implements published calendar and lectionary rules in software; parish and diocesan practice may vary.

## License

The software is licensed under the MIT License — see [`LICENSE`](LICENSE).

Additional copyright and permission language for **Revised Common Lectionary**, **Common Worship**, **BCP**, and related texts appears in [`packages/calendar/readme.md`](packages/calendar/readme.md#license).
