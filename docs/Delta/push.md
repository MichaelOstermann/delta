# push

```ts
function Delta.push(ops: Delta, op: Op): Delta
```

Pushes an operation onto the delta, merging with the previous operation if possible.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.push([], { type: "insert", value: "Hello" });
// [{ type: "insert", value: "Hello" }]

Delta.push(Delta.push([], { type: "insert", value: "Hello" }), {
    type: "insert",
    value: " world",
});
// [{ type: "insert", value: "Hello world" }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe([], Delta.push({ type: "insert", value: "Hello" }));
// [{ type: "insert", value: "Hello" }]

pipe(
    [],
    Delta.push({ type: "insert", value: "Hello" }),
    Delta.push({ type: "insert", value: " world" }),
);
// [{ type: "insert", value: "Hello world" }]
```

:::
