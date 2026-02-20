# concat

```ts
function Delta.concat(a: Delta, b: Delta): Delta
```

Concatenates two deltas together, merging adjacent operations if possible.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = Delta.insert([], " world");

Delta.concat(a, b);
// [{ type: "insert", value: "Hello world" }]

const bold = Delta.insert([], "Hello", { bold: true });
const italic = Delta.insert([], " world", { italic: true });

Delta.concat(bold, italic);
// [{ type: "insert", value: "Hello", attributes: { bold: true } },
//  { type: "insert", value: " world", attributes: { italic: true } }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = Delta.insert([], " world");

pipe(a, Delta.concat(b));
// [{ type: "insert", value: "Hello world" }]
```

:::
