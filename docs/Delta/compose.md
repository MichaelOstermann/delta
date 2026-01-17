# compose

```ts
function Delta.compose<T>(a: Delta<T>, b: Delta<T>): Delta<T>
```

Composes two deltas into a single delta that represents applying `a` then `b`.

## Example

::: code-group

<!-- prettier-ignore -->
```ts [data-first]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = pipe(
    [],
    Delta.retain(5),
    Delta.insert(" world")
);

Delta.compose(a, b);
// [{ type: "insert", value: "Hello world" }]

const format = Delta.retain([], 5, { bold: true });

Delta.compose(a, format);
// [{ type: "insert", value: "Hello", attributes: { bold: true } }]
```

<!-- prettier-ignore -->
```ts [data-last]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = pipe(
    [],
    Delta.retain(5),
    Delta.insert(" world")
);

pipe(a, Delta.compose(b));
// [{ type: "insert", value: "Hello world" }]
```

:::
