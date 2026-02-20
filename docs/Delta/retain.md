# retain

```ts
function Delta.retain(
  ops: Delta,
  length: number,
  attributes?: OpAttributes | null,
): Delta
```

Adds a retain operation to the delta, optionally with attributes to apply formatting.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.retain([], 5);
// [{ type: "retain", value: 5 }]

Delta.retain([], 5, { bold: true });
// [{ type: "retain", value: 5, attributes: { bold: true } }]
```

<!-- prettier-ignore -->
```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe([], Delta.retain(5));
// [{ type: "retain", value: 5 }]

pipe(
    [],
    Delta.retain(3),
    Delta.retain(2, { italic: true })
);
// [{ type: "retain", value: 3 },
//  { type: "retain", value: 2, attributes: { italic: true } }]
```

:::

## Removing attributes

Use `null` to remove an attribute when composing deltas:

```ts
import { Delta } from "@monstermann/delta";

const doc = Delta.insert([], "Hello", { bold: true });
// [{ type: "insert", value: "Hello", attributes: { bold: true } }]

const removeBold = Delta.retain([], 5, { bold: null });
// [{ type: "retain", value: 5, attributes: { bold: null } }]

Delta.compose(doc, removeBold);
// [{ type: "insert", value: "Hello" }]
```
