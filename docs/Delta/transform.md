# transform

```ts
function Delta.transform(
  a: Delta,
  b: Delta,
  priority?: boolean,
): Delta
```

Transforms delta `b` to account for delta `a` having been applied first. When both deltas insert at the same position, `priority` determines which insert comes first.

## Example

::: code-group

<!-- prettier-ignore -->
```ts [data-first]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = Delta.insert([], "World");

Delta.transform(a, b, true);
// [{ retain: 5 },
//  { insert: "World" }]

Delta.transform(a, b, false);
// [{ insert: "World" }]

const format = Delta.retain([], 5, { bold: true });
const insert = pipe(
    [],
    Delta.retain(2),
    Delta.insert("XXX")
);

Delta.transform(insert, format);
// [{ retain: 8, attributes: { bold: true } }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = Delta.insert([], "World");

pipe(a, Delta.transform(b, true));
// [{ retain: 5 },
//  { insert: "World" }]
```

:::
