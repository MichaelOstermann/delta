# insert

```ts
function Delta.insert<T>(
  ops: Delta<T>,
  content: string,
  attributes?: T | null,
): Delta<T>
```

Adds an insert operation to the delta.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.insert([], "Hello");
// [{ type: "insert", value: "Hello" }]

Delta.insert([], "Hello", { bold: true });
// [{ type: "insert", value: "Hello", attributes: { bold: true } }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe([], Delta.insert("Hello"));
// [{ type: "insert", value: "Hello" }]

pipe(
    [],
    Delta.insert("Hello", { bold: true }),
    Delta.insert(" world", { italic: true }),
);
// [{ type: "insert", value: "Hello", attributes: { bold: true } },
//  { type: "insert", value: " world", attributes: { italic: true } }]
```

:::
