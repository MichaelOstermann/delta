# insert

```ts
function Delta.insert(
  ops: Delta,
  content: string | EmbedValue,
  attributes?: OpAttributes | null,
): Delta
```

Adds an insert operation to the delta.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.insert([], "Hello");
// [{ insert: "Hello" }]

Delta.insert([], "Hello", { bold: true });
// [{ insert: "Hello", attributes: { bold: true } }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe([], Delta.insert("Hello"));
// [{ insert: "Hello" }]

pipe(
    [],
    Delta.insert("Hello", { bold: true }),
    Delta.insert(" world", { italic: true }),
);
// [{ insert: "Hello", attributes: { bold: true } },
//  { insert: " world", attributes: { italic: true } }]
```

:::
