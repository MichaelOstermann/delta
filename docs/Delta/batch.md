# batch

```ts
function Delta.batch<T>(
  ops: Delta<T>,
  transform: (delta: Delta<T>) => Delta<T>,
): Delta<T>
```

Batches multiple delta operations together for improved performance.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.batch([], (delta) => {
    // First change copies:
    delta = Delta.insert(delta, "Hello", { bold: true });
    // Other changes mutate:
    delta = Delta.insert(delta, " world");
    return delta;
});
// [{ type: "insert", value: "Hello", attributes: { bold: true } },
//  { type: "insert", value: " world" }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe(
    [],
    Delta.batch((delta) => {
        // First change copies:
        delta = Delta.insert(delta, "Hello", { bold: true });
        // Other changes mutate:
        delta = Delta.insert(delta, " world");
        return delta;
    }),
);
// [{ type: "insert", value: "Hello", attributes: { bold: true } },
//  { type: "insert", value: " world" }]
```

:::
