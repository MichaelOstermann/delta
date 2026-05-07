# push

```ts
function Delta.push(ops: Delta, op: Op): Delta
```

Pushes an operation onto the delta, merging with the previous operation if possible.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.push([], { insert: "Hello" });
// [{ insert: "Hello" }]

Delta.push(Delta.push([], { insert: "Hello" }), { insert: " world" });
// [{ insert: "Hello world" }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe([], Delta.push({ insert: "Hello" }));
// [{ insert: "Hello" }]

pipe([], Delta.push({ insert: "Hello" }), Delta.push({ insert: " world" }));
// [{ insert: "Hello world" }]
```

:::
