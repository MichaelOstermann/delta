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
// [{ insert: "Hello" }]

Delta.chop(pipe(
    [],
    Delta.insert("Hello"),
    Delta.retain(5, { bold: true })
));
// [{ insert: "Hello" },
//  { retain: 5, attributes: { bold: true } }]
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
// [{ insert: "Hello" }]
```

:::
