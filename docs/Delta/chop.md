# chop

```ts
function Delta.chop(ops: Delta): Delta
```

Removes a trailing retain operation if it has no attributes.

## Example

::: code-group

<!-- prettier-ignore -->
```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.chop(pipe(
    [],
    Delta.insert("Hello"),
    Delta.retain(5)
));
// [{ type: "insert", value: "Hello" }]

Delta.chop(pipe(
    [],
    Delta.insert("Hello"),
    Delta.retain(5, { bold: true })
));
// [{ type: "insert", value: "Hello" },
//  { type: "retain", value: 5, attributes: { bold: true } }]
```

<!-- prettier-ignore -->
```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe(
    [],
    Delta.insert("Hello"),
    Delta.retain(5),
    Delta.chop()
);
// [{ type: "insert", value: "Hello" }]
```

:::
