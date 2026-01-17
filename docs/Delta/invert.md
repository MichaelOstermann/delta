# invert

```ts
function Delta.invert<T>(a: Delta<T>, b: Delta<T>): Delta<T>
```

Returns the inverse of a delta against a base document. Applying the inverted delta undoes the original change.

## Example

::: code-group

<!-- prettier-ignore -->
```ts [data-first]
import { Delta } from "@monstermann/delta";

const base = Delta.insert([], "Hello");
const change = Delta.retain([], 5, { bold: true });

Delta.invert(change, base);
// [{ type: "retain", value: 5, attributes: { bold: null } }]

const insert = pipe(
    [],
    Delta.retain(5),
    Delta.insert(" world")
);

Delta.invert(insert, base);
// [{ type: "retain", value: 5 },
//  { type: "remove", value: 6 }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

const base = Delta.insert([], "Hello");
const change = Delta.retain([], 5, { bold: true });

pipe(change, Delta.invert(base));
// [{ type: "retain", value: 5, attributes: { bold: null } }]
```

:::
