# Anglicana

Utility functions and open-data from Church of England websites, books, etc.

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

```ts
import { getEasterSunday } from "@phughesmcr/anglicana";
console.log(getEasterSunday("2025"));
```

### Browser

ℹ️ Builds for `ES6` (targetting early 2022 browsers like Chrome 98) and `ES2022` (targetting 2024 browsers like Chrome 127) are available in the `/dist` directory.

```html
<script src="https://cdn.jsdelivr.net/npm/temporal-polyfill@0.2.5/global.min.js"></script>

<script type="module">
  import { getEasterSunday } from "./anglicana.es6.min.js";
  console.log(getEasterSunday("2025"));
</script>
```

## Build &amp; Contribute

Anglicana is built using [Deno](https://deno.com/) and written in [TypeScript](https://www.typescriptlang.org/).

You can build the project with:
```bash
deno task build
```

Before contributing, please run:
```bash
deno task contribute
```

This will install the project's pre-commit hooks. These will various tasks such as `deno task check` when making a commit.

Please document any contributions and add tests for any new or changed functionality.

## Disclaimer

Anglicana is not affiliated with the Church of England or any other official or unofficial body.

ANGLICANA IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## License

Anglicana is copyright © P. Hughes 2024 and licensed under the MIT license.

The Revised Common Lectionary is copyright © the Consultation on Common Texts 1992.

The Daily Eucharistic Lectionary is adapted from the Ordo Lectionum Missae of the Roman Catholic Church, reproduced by permission of the International Commission on English in the Liturgy.

Adaptations and additions to the RCL and the DEL, together with Second and Third Service lectionaries and the Weekday Lectionary for Morning and Evening Prayer are copyright © the Archbishops’ Council 1997–2010.

The Additional Weekday Lectionary is copyright © the Archbishops’ Council 2010.

A Lectionary and Additional Collects for Holy Communion [BCP] originates in the 1928 BCP and the BCP according to the use of India, Pakistan, Burma and Ceylon (1960) and was authorized in the Church of England in 1965.

The Anglican Cycle of Prayer is published by the Anglican Consultative Council www.anglicancommunion.org/acp.

New Revised Standard Version Bible: Anglicized Edition, copyright © 1989, 1995 National Council of the Churches of Christ in the United States of America. Used by permission. All rights reserved worldwide. nrsvbibles.org.

The Common Worship psalter is © The Archbishops’ Council of the Church of England, 2000. Common Worship texts are available at www.churchofengland.org/prayer-and-worship/worship-texts-and-resources.

Texts from The Book of Common Prayer, and from the Authorized Version of the Bible, the rights in which in the United Kingdom are vested in the Crown, are reproduced by permission of the Crown’s patentee, Cambridge University Press.
