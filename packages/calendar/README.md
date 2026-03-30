# Anglicana

A TypeScript library for Church of England calendar calculations and liturgical data. Provides utility functions for
calculating dates of feasts, holy days, and church seasons using the Temporal API. Implements Common Worship calendar
rules including transfer rules and conflict resolution.

## API

Run `deno task doc` from the **repository root** to generate HTML API reference under `./docs/` (repository root;
ignored by git by default—use locally or publish the output alongside your site).

## Requirements

- **Deno 2.7+** for local development, `deno task build` (`deno bundle`), and the checks in this repository’s CI. From
  Deno 2.7 onward, Temporal is available without an unstable flag; older Deno releases are unsupported for this project.
- **Temporal**: this library uses the [Temporal API](https://tc39.es/proposal-temporal/docs/). Run `deno task check` and
  `deno task test` from the **repository root** (tasks and `include`/`test` globs are defined in the root `deno.json`).

## Usage

⚠️ The `Temporal` global is required. If not available, you can use the polyfill, as in the browser example below.

### Node / Deno / Bun

```bash
# node
npx jsr install @phughesmcr/anglicana

# deno
deno add jsr:@phughesmcr/anglicana

# bun
bunx jsr add @phughesmcr/anglicana
```

### Basic Usage

```ts
import { generateLiturgicalCalendar, getEasterSunday, getFirstSundayOfAdvent } from "@phughesmcr/anglicana/calendar";

// Get individual dates
console.log(getEasterSunday(2025).toString()); // "2025-04-20"
console.log(getFirstSundayOfAdvent(2025).toString()); // "2025-11-30"

// Generate a full liturgical calendar for church year 2025
// (runs from Advent Sunday 2024 to the day before Advent Sunday 2025)
const calendar = generateLiturgicalCalendar(2025);

calendar.forEach((event) => {
  console.log(`${event.date}: ${event.name} (${event.type})`);
});
```

Each `CalendarEvent` has at least `id`, `name`, `type`, `date` (`Temporal.PlainDate`), and `eventType` (`"fixed"` |
`"moveable"`). You may also see `rules`, `description`, `relativeTo` / `offsetDays` for moveable rows, `originalDate`
and `observance` when something is transferred or duplicated (e.g. optional secondary All Saints on 1 November),
`eucharisticProperAs` on the two Sundays affected by the 22nd/23rd-after-Trinity proper swap, and **`optional: true`**
where the observance is rubrically optional (e.g. Corpus Christi, Easter Vigil). Filter or label on `optional` if your
UI should distinguish required from permitted observances.

The full calendar also emits **Nine Days of Prayer (after Ascension)**—nine `special_observance` entries from the day
after Ascension through the eve of Pentecost—as named in the
[Common Worship Rules to Order the Christian Year](https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/rules).

### Looking up many dates

`getEventsForDate` runs `generateLiturgicalCalendar` for the whole year on **each** call. For month views, exports, or
debug grids, generate once and index by ISO date:

```ts
import {
  generateLiturgicalCalendar,
  groupCalendarEventsByDate,
  liturgicalYearFromChurchYear,
} from "@phughesmcr/anglicana/calendar";

const churchYear = 2026;
const ly = liturgicalYearFromChurchYear(churchYear);
const byDay = groupCalendarEventsByDate(
  generateLiturgicalCalendar(ly, { canonicalMode: "pastoral" }),
);

const eventsOnChristmas = byDay.get("2025-12-25") ?? [];
```

For a single day from an existing array, use `getEventsForDateFromCalendar` or `filterCalendarEventsForDate` (see API
docs).

### Browser

Run `deno task calendar:bundle` (or `deno task build` for check + bundle) from the **repository root** to produce a
minified ESM bundle at `dist/anglicana.js` in this package (generate it locally or in CI when you need a file to host or
serve). Use a current evergreen browser or ensure your target supports the syntax emitted by `deno bundle`.

```html
<script src="https://cdn.jsdelivr.net/npm/temporal-polyfill@0.2.5/global.min.js"></script>

<script type="module">
  import { generateLiturgicalCalendar, getEasterSunday } from "./dist/anglicana.js";
  console.log(getEasterSunday(2025).toString());

  const calendar = generateLiturgicalCalendar(2025);
  console.log(calendar);
</script>
```

### React (Vite and similar bundlers)

1. **Install** the package with your toolchain’s JSR integration, for example:

   ```bash
   npx jsr add @phughesmcr/anglicana
   ```

2. **Load Temporal before Anglicana.** Most browsers do not yet provide a usable global `Temporal`; import a polyfill at
   the very top of your client entry (e.g. `main.tsx`) _before_ any import that pulls in this library:

   ```ts
   import "@js-temporal/polyfill";
   ```

   Alternatively, use another Temporal polyfill that installs `globalThis.Temporal`, consistent with the script-tag
   approach in the [Browser](#browser) section above.

3. **Then** import and use Anglicana as usual:

   ```ts
   import { generateLiturgicalCalendar, getEasterSunday } from "@phughesmcr/anglicana/calendar";
   ```

   `CalendarEvent.date` values are `Temporal.PlainDate` instances. For JSON, `localStorage`, or server boundaries,
   serialize with `.toString()` and reconstruct with `Temporal.PlainDate.from(...)` where needed.

4. **SSR (e.g. Next.js):** ensure the same `Temporal` global exists in the server runtime if you call these functions
   during render, or restrict calendar generation to client-only modules.

## Canonical Modes

The library supports two modes for calendar generation:

### Canonical Mode (Default)

Strict calendar dates for optional transfers: Epiphany on 6 January, Presentation on 2 February, All Saints on 1
November, Blessed Virgin Mary on 15 August. Required transfers (e.g. Annunciation in Holy Week) still apply. Other
discretionary transfers stay off:

```ts
import { generateLiturgicalCalendar } from "@phughesmcr/anglicana/calendar";

// Canonical is the default — matches the Calendar table unless a rule requires a move
const calendar = generateLiturgicalCalendar(2025);

// Equivalent to:
const calendar = generateLiturgicalCalendar(2025, { canonicalMode: "canonical" });
```

### Pastoral Mode

Common Worship parish defaults: optional Sunday transfers (Epiphany, Candlemas, All Saints), BVM to 8 September,
`transferFestivalsOnOrdinarySundays` (festivals on generic “ordinary” Sundays are nudged off Sunday), blocked lesser
festivals, and local principal to nearest Sunday. **First and Second Sundays of Christmas**—Sundays in the range 26
December–5 January—are **not** treated as ordinary Sundays for that discretionary rule, so a festival such as **Holy
Innocents** may remain on Sunday when it falls on one of those Sundays (see the same
[Rules](https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/rules)).

```ts
import { generateLiturgicalCalendar } from "@phughesmcr/anglicana/calendar";

const pastoralCalendar = generateLiturgicalCalendar(2025, { canonicalMode: "pastoral" });
```

### Individual Transfer Options

You can override individual transfer settings regardless of mode:

```ts
import { generateLiturgicalCalendar } from "@phughesmcr/anglicana/calendar";

const calendar = generateLiturgicalCalendar(2025, {
  canonicalMode: "canonical",
  transferEpiphanyToSunday: true, // Sunday between 2–8 January (optional CW transfer)
  transferPresentationToSunday: true, // Candlemas to Sunday in CW window
  transferAllSaintsToSunday: true, // All Saints to Sunday in CW window
  transferBlessedVirginMaryToSeptember: true, // BVM to 8 September
  transferFestivalsOnOrdinarySundays: false, // Don't transfer festivals on ordinary Sundays
  transferLesserFestivalsWhenBlocked: false, // Don't transfer blocked lesser festivals
  includeCommemorationsAndLesserFestivals: true, // Include commemorations (default)
});
```

## Local Celebrations

You can inject local patronal, dedication, and harvest celebrations with canonical transfer rules:

```ts
import { generateLiturgicalCalendar } from "@phughesmcr/anglicana/calendar";

const calendar = generateLiturgicalCalendar(2025, {
  localEvents: [
    { name: "Parish Patronal Festival", type: "principal_feast", date: "2025-07-10", localType: "patronal" },
    { name: "Dedication Festival", type: "festival", date: "2025-09-14", localType: "dedication" },
    { name: "Harvest Thanksgiving", type: "special_observance", date: "2025-10-05", localType: "harvest" },
  ],
  transferLocalPrincipalToNearestSunday: true, // Transfer local principal feasts to nearest Sunday
});
```

## Individual Date Functions

The library exports many helper functions for calculating specific liturgical dates:

```ts
import {
  getAllSaintsDay,
  getAnnunciation,
  getAscensionDay,
  // Principal Holy Days
  getAshWednesday,
  getChristmasDay,
  getChristTheKing,
  getClosestSunday,
  getCorpusChristi,
  getDayOfPentecost,
  // Principal Feasts
  getEasterSunday,
  getEpiphany,
  // Church Year
  getFirstSundayOfAdvent,
  getGoodFriday,
  // Seasonal
  getHolyWeek,
  getLiturgicalYear,
  getLiturgicalYearRange,
  getMaundyThursday,
  getNextSunday,
  getNovena,
  getPalmSunday,
  getPresentationOfChristInTheTemple,
  getPreviousSunday,
  getRogationDays,
  // Lectionary
  getSundayLectionaryLetter,
  getSundaysOfChurchYear,
  // Moveable Festivals
  getTheBaptismOfChrist,
  getTrinitySunday,
  getWeekdayLectionaryNumber,
  // Sunday utilities
  isSunday,
} from "@phughesmcr/anglicana/calendar";

// Examples
console.log(getEasterSunday(2025).toString()); // "2025-04-20"
console.log(getSundayLectionaryLetter(2025)); // "C"
console.log(getWeekdayLectionaryNumber("2025-06-15")); // 1
console.log(getLiturgicalYear("2025-01-15")); // 2024 (still in church year 2025)
```

## Build & Contribute

Anglicana is built using [Deno](https://deno.com/) and written in [TypeScript](https://www.typescriptlang.org/).

You can build the project with:

```bash
deno task build
```

(Run these tasks from the repository root; they are defined in the root `deno.json`.)

Test your changes with:

```bash
deno task test
```

Before contributing, please run:

```bash
deno task contribute
```

This will install the project's pre-commit hooks. These will run various tasks such as `deno task check` when making a
commit.

Please document any contributions and add tests for any new or changed functionality. Please try to follow
[Deno's internal style guide](https://docs.deno.com/runtime/contributing/style_guide/) where possible.

## Disclaimer

Anglicana is not affiliated with the Church of England or any other official or unofficial body.

ANGLICANA IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## License

Anglicana is copyright © P. Hughes 2026 and licensed under the MIT license.

The Revised Common Lectionary is copyright © the Consultation on Common Texts 1992.

The Daily Eucharistic Lectionary is adapted from the Ordo Lectionum Missae of the Roman Catholic Church, reproduced by
permission of the International Commission on English in the Liturgy.

Adaptations and additions to the RCL and the DEL, together with Second and Third Service lectionaries and the Weekday
Lectionary for Morning and Evening Prayer are copyright © the Archbishops' Council 1997–2010.

The Additional Weekday Lectionary is copyright © the Archbishops' Council 2010.

A Lectionary and Additional Collects for Holy Communion [BCP] originates in the 1928 BCP and the BCP according to the
use of India, Pakistan, Burma and Ceylon (1960) and was authorized in the Church of England in 1965.

The Anglican Cycle of Prayer is published by the Anglican Consultative Council <www.anglicancommunion.org/acp>.

New Revised Standard Version Bible: Anglicized Edition, copyright © 1989, 1995 National Council of the Churches of
Christ in the United States of America. Used by permission. All rights reserved worldwide. nrsvbibles.org.

The Common Worship psalter is © The Archbishops' Council of the Church of England, 2000. Common Worship texts are
available at <www.churchofengland.org/prayer-and-worship/worship-texts-and-resources>.

Texts from The Book of Common Prayer, and from the Authorized Version of the Bible, the rights in which in the United
Kingdom are vested in the Crown, are reproduced by permission of the Crown's patentee, Cambridge University Press.
