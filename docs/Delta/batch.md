# batch

```ts
function Delta.batch(
  ops: Delta,
  transform: (delta: Delta) => Delta,
): Delta
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
// [{ insert: "Hello", attributes: { bold: true } },
//  { insert: " world" }]
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
// [{ insert: "Hello", attributes: { bold: true } },
//  { insert: " world" }]
```

:::
