# remove

```ts
function Delta.remove<T>(ops: Delta<T>, length: number): Delta<T>
```

Adds a remove operation to the delta.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.remove([], 5);
// [{ type: "remove", value: 5 }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe([], Delta.remove(5));
// [{ type: "remove", value: 5 }]

pipe([], Delta.retain(3), Delta.remove(5));
// [{ type: "retain", value: 3 },
//  { type: "remove", value: 5 }]
```

:::
