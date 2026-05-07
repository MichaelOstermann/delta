# diff

```ts
function Delta.diff(a: Delta, b: Delta, cursor?: number): Delta
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
// [{ retain: 5 },
//  { insert: " world" }]

const plain = Delta.insert([], "Hello");
const bold = Delta.insert([], "Hello", { bold: true });

Delta.diff(plain, bold);
// [{ retain: 5, attributes: { bold: true } }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = Delta.insert([], "Hello world");

pipe(a, Delta.diff(b));
// [{ retain: 5 },
//  { insert: " world" }]
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
// [{ retain: 3 },
//  { insert: " bar foo" }]

// cursor=0: user typed "foo bar " at the beginning
Delta.diff(a, b, 0);
// [{ insert: "foo bar " }]
```
