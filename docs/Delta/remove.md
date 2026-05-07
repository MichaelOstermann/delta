# remove

```ts
function Delta.remove(ops: Delta, length: number): Delta
```

Adds a remove operation to the delta.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.remove([], 5);
// [{ delete: 5 }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe([], Delta.remove(5));
// [{ delete: 5 }]

pipe([], Delta.retain(3), Delta.remove(5));
// [{ retain: 3 },
//  { delete: 5 }]
```

:::
