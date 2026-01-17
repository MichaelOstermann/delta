# equals

```ts
function Delta.equals<T>(a: Delta<T>, b: Delta<T>): boolean
```

Checks if two deltas are equal by comparing their operations and attributes.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello", { bold: true });
const b = Delta.insert([], "Hello", { bold: true });
const c = Delta.insert([], "Hello", { italic: true });

Delta.equals(a, b); // true
Delta.equals(a, c); // false
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello", { bold: true });
const b = Delta.insert([], "Hello", { bold: true });

pipe(a, Delta.equals(b)); // true
```

:::
