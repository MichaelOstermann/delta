# diff

```ts
function Delta.diff<T>(a: Delta<T>, b: Delta<T>, cursor?: number): Delta<T>
```

Computes the difference between two document deltas, returning a delta that transforms `a` into `b`.

The optional `cursor` parameter provides a hint about where the user's cursor is positioned. This helps produce more intuitive diffs when there are multiple valid ways to represent the same change.

## Example

::: code-group

```ts [data-first]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = Delta.insert([], "Hello world");

Delta.diff(a, b);
// [{ type: "retain", value: 5 },
//  { type: "insert", value: " world" }]

const plain = Delta.insert([], "Hello");
const bold = Delta.insert([], "Hello", { bold: true });

Delta.diff(plain, bold);
// [{ type: "retain", value: 5, attributes: { bold: true } }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = Delta.insert([], "Hello world");

pipe(a, Delta.diff(b));
// [{ type: "retain", value: 5 },
//  { type: "insert", value: " world" }]
```

:::

## Cursor hint

When text changes are ambiguous, the cursor position determines where the change is placed:

```ts
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "foo");
const b = Delta.insert([], "foo bar foo");

// cursor=3: user typed " bar foo" at the end
Delta.diff(a, b, 3);
// [{ type: "retain", value: 3 },
//  { type: "insert", value: " bar foo" }]

// cursor=0: user typed "foo bar " at the beginning
Delta.diff(a, b, 0);
// [{ type: "insert", value: "foo bar " }]
```
