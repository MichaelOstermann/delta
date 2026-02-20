# slice

```ts
function Delta.slice(ops: Delta, start: number, end?: number): Delta
```

Returns a portion of the delta from `start` to `end`.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

const delta = Delta.insert([], "Hello world");

Delta.slice(delta, 0, 5);
// [{ type: "insert", value: "Hello" }]

Delta.slice(delta, 6);
// [{ type: "insert", value: "world" }]

const formatted = pipe(
    [],
    Delta.insert("Hello", { bold: true }),
    Delta.insert(" world", { italic: true }),
);

Delta.slice(formatted, 3, 8);
// [{ type: "insert", value: "lo", attributes: { bold: true } },
//  { type: "insert", value: " wo", attributes: { italic: true } }]
```

<!-- prettier-ignore -->
```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe(
    [],
    Delta.insert("Hello world"),
    Delta.slice(0, 5)
);
// [{ type: "insert", value: "Hello" }]

pipe(
    [],
    Delta.insert("Hello world"),
    Delta.slice(6)
);
// [{ type: "insert", value: "world" }]
```

:::
