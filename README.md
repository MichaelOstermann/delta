<div align="center">

<h1>delta</h1>

![Minified](https://img.shields.io/badge/Minified-16.27_KB-blue?style=flat-square&labelColor=%2315161D&color=%2369a1ff) ![Minzipped](https://img.shields.io/badge/Minzipped-5.22_KB-blue?style=flat-square&labelColor=%2315161D&color=%2369a1ff)

**Functional operational-transform.**

[Documentation](https://MichaelOstermann.github.io/delta)

</div>

## Differences from quill-delta

This library has been largely ported from [quill-delta](https://github.com/slab/delta), some differences:

- Immutable with optional transient mutations
- Functional data-first/data-last API acting upon plain arrays
- Operations have been migrated to a monomorphic, tagged union
- The `delete` operation has been renamed to `remove`, as `delete` is a reserved keyword
- Support for nested attributes has been removed
- Cloning is only done when the data actually changes
- Deep-cloning has been replaced with shallow-cloning
- Around 50% smaller

## Example

```ts
import { Delta } from "@monstermann/delta";

// Create a document
const doc = Delta.insert([], "Hello world");

// Create a change that makes "Hello" bold
const change = Delta.retain([], 5, { bold: true });

// Apply the change
const result = Delta.compose(doc, change);
// [{ type: "insert", value: "Hello", attributes: { bold: true } },
//  { type: "insert", value: " world" }]

// Compute the difference between two documents
const a = Delta.insert([], "Hello");
const b = Delta.insert([], "Hello world");

Delta.diff(a, b);
// [{ type: "retain", value: 5 },
//  { type: "insert", value: " world" }]
```

## Installation

```sh [npm]
npm install @monstermann/delta
```

```sh [pnpm]
pnpm add @monstermann/delta
```

```sh [yarn]
yarn add @monstermann/delta
```

```sh [bun]
bun add @monstermann/delta
```

## Delta

### batch

```ts
function Delta.batch(
  ops: Delta,
  transform: (delta: Delta) => Delta,
): Delta
```

Batches multiple delta operations together for improved performance.

#### Example

```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.batch([], (delta) => {
    // First change copies:
    delta = Delta.insert(delta, "Hello", { bold: true });
    // Other changes mutate:
    delta = Delta.insert(delta, " world");
    return delta;
});
// [{ type: "insert", value: "Hello", attributes: { bold: true } },
//  { type: "insert", value: " world" }]
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
// [{ type: "insert", value: "Hello", attributes: { bold: true } },
//  { type: "insert", value: " world" }]
```

### chop

```ts
function Delta.chop(ops: Delta): Delta
```

Removes a trailing retain operation if it has no attributes.

#### Example

<!-- prettier-ignore -->
```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.chop(pipe(
    [],
    Delta.insert("Hello"),
    Delta.retain(5)
));
// [{ type: "insert", value: "Hello" }]

Delta.chop(pipe(
    [],
    Delta.insert("Hello"),
    Delta.retain(5, { bold: true })
));
// [{ type: "insert", value: "Hello" },
//  { type: "retain", value: 5, attributes: { bold: true } }]
```

<!-- prettier-ignore -->
```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe(
    [],
    Delta.insert("Hello"),
    Delta.retain(5),
    Delta.chop()
);
// [{ type: "insert", value: "Hello" }]
```

### clean

```ts
function Delta.clean(ops: Delta): Delta
```

Normalizes the delta by merging consecutive operations of the same type and attributes.

#### Example

<!-- prettier-ignore -->
```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.clean(pipe(
    [],
    Delta.insert("Hello"),
    Delta.insert(" world")
));
// [{ type: "insert", value: "Hello world" }]

Delta.clean(
    pipe(
        [],
        Delta.insert("Hello", { bold: true }),
        Delta.insert(" world", { bold: true }),
    ),
);
// [{ type: "insert", value: "Hello world", attributes: { bold: true } }]
```

<!-- prettier-ignore -->
```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe(
    [],
    Delta.insert("Hello"),
    Delta.insert(" world"),
    Delta.clean()
);
// [{ type: "insert", value: "Hello world" }]
```

### compose

```ts
function Delta.compose(a: Delta, b: Delta): Delta
```

Composes two deltas into a single delta that represents applying `a` then `b`.

#### Example

<!-- prettier-ignore -->
```ts [data-first]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = pipe(
    [],
    Delta.retain(5),
    Delta.insert(" world")
);

Delta.compose(a, b);
// [{ type: "insert", value: "Hello world" }]

const format = Delta.retain([], 5, { bold: true });

Delta.compose(a, format);
// [{ type: "insert", value: "Hello", attributes: { bold: true } }]
```

<!-- prettier-ignore -->
```ts [data-last]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = pipe(
    [],
    Delta.retain(5),
    Delta.insert(" world")
);

pipe(a, Delta.compose(b));
// [{ type: "insert", value: "Hello world" }]
```

### concat

```ts
function Delta.concat(a: Delta, b: Delta): Delta
```

Concatenates two deltas together, merging adjacent operations if possible.

#### Example

```ts [data-first]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = Delta.insert([], " world");

Delta.concat(a, b);
// [{ type: "insert", value: "Hello world" }]

const bold = Delta.insert([], "Hello", { bold: true });
const italic = Delta.insert([], " world", { italic: true });

Delta.concat(bold, italic);
// [{ type: "insert", value: "Hello", attributes: { bold: true } },
//  { type: "insert", value: " world", attributes: { italic: true } }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = Delta.insert([], " world");

pipe(a, Delta.concat(b));
// [{ type: "insert", value: "Hello world" }]
```

### diff

```ts
function Delta.diff(a: Delta, b: Delta, cursor?: number): Delta
```

Computes the difference between two document deltas, returning a delta that transforms `a` into `b`.

The optional `cursor` parameter provides a hint about where the user's cursor is positioned. This helps produce more intuitive diffs when there are multiple valid ways to represent the same change.

#### Example

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

#### Cursor hint

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

### equals

```ts
function Delta.equals(a: Delta, b: Delta): boolean
```

Checks if two deltas are equal by comparing their operations and attributes.

#### Example

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

### insert

```ts
function Delta.insert(
  ops: Delta,
  content: string | EmbedValue,
  attributes?: OpAttributes | null,
): Delta
```

Adds an insert operation to the delta.

#### Example

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

### invert

```ts
function Delta.invert(a: Delta, b: Delta): Delta
```

Returns the inverse of a delta against a base document. Applying the inverted delta undoes the original change.

#### Example

<!-- prettier-ignore -->
```ts [data-first]
import { Delta } from "@monstermann/delta";

const base = Delta.insert([], "Hello");
const change = Delta.retain([], 5, { bold: true });

Delta.invert(change, base);
// [{ type: "retain", value: 5, attributes: { bold: null } }]

const insert = pipe(
    [],
    Delta.retain(5),
    Delta.insert(" world")
);

Delta.invert(insert, base);
// [{ type: "retain", value: 5 },
//  { type: "remove", value: 6 }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

const base = Delta.insert([], "Hello");
const change = Delta.retain([], 5, { bold: true });

pipe(change, Delta.invert(base));
// [{ type: "retain", value: 5, attributes: { bold: null } }]
```

### length

```ts
function Delta.length(ops: Delta): number
```

Returns the total length of the delta (sum of all operation lengths).

#### Example

<!-- prettier-ignore -->
```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.length(Delta.insert([], "Hello")); // 5

Delta.length(pipe(
    [],
    Delta.insert("Hello"),
    Delta.retain(3),
    Delta.remove(2)
)); // 10
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe([], Delta.insert("Hello"), Delta.length()); // 5

pipe(
    [],
    Delta.insert("Hello"),
    Delta.retain(3),
    Delta.remove(2),
    Delta.length(),
); // 10
```

### push

```ts
function Delta.push(ops: Delta, op: Op): Delta
```

Pushes an operation onto the delta, merging with the previous operation if possible.

#### Example

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

### remove

```ts
function Delta.remove(ops: Delta, length: number): Delta
```

Adds a remove operation to the delta.

#### Example

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

### retain

```ts
function Delta.retain(
  ops: Delta,
  length: number,
  attributes?: OpAttributes | null,
): Delta
```

Adds a retain operation to the delta, optionally with attributes to apply formatting.

#### Example

```ts [data-first]
import { Delta } from "@monstermann/delta";

Delta.retain([], 5);
// [{ type: "retain", value: 5 }]

Delta.retain([], 5, { bold: true });
// [{ type: "retain", value: 5, attributes: { bold: true } }]
```

<!-- prettier-ignore -->
```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe([], Delta.retain(5));
// [{ type: "retain", value: 5 }]

pipe(
    [],
    Delta.retain(3),
    Delta.retain(2, { italic: true })
);
// [{ type: "retain", value: 3 },
//  { type: "retain", value: 2, attributes: { italic: true } }]
```

#### Removing attributes

Use `null` to remove an attribute when composing deltas:

```ts
import { Delta } from "@monstermann/delta";

const doc = Delta.insert([], "Hello", { bold: true });
// [{ type: "insert", value: "Hello", attributes: { bold: true } }]

const removeBold = Delta.retain([], 5, { bold: null });
// [{ type: "retain", value: 5, attributes: { bold: null } }]

Delta.compose(doc, removeBold);
// [{ type: "insert", value: "Hello" }]
```

### slice

```ts
function Delta.slice(ops: Delta, start: number, end?: number): Delta
```

Returns a portion of the delta from `start` to `end`.

#### Example

```ts [data-first]
import { Delta } from "@monstermann/delta";

const delta = Delta.insert([], "Hello world");

Delta.slice(delta, 0, 5);
// [{ type: "insert", value: "Hello" }]

Delta.slice(delta, 6);
// [{ type: "insert", value: "world" }]

const formatted = pipe(
    [],
    Delta.insert("Hello", { bold: true }),
    Delta.insert(" world", { italic: true }),
);

Delta.slice(formatted, 3, 8);
// [{ type: "insert", value: "lo", attributes: { bold: true } },
//  { type: "insert", value: " wo", attributes: { italic: true } }]
```

<!-- prettier-ignore -->
```ts [data-last]
import { Delta } from "@monstermann/delta";

pipe(
    [],
    Delta.insert("Hello world"),
    Delta.slice(0, 5)
);
// [{ type: "insert", value: "Hello" }]

pipe(
    [],
    Delta.insert("Hello world"),
    Delta.slice(6)
);
// [{ type: "insert", value: "world" }]
```

### transform

```ts
function Delta.transform(
  a: Delta,
  b: Delta,
  priority?: boolean,
): Delta
```

Transforms delta `b` to account for delta `a` having been applied first. When both deltas insert at the same position, `priority` determines which insert comes first.

#### Example

<!-- prettier-ignore -->
```ts [data-first]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = Delta.insert([], "World");

Delta.transform(a, b, true);
// [{ type: "retain", value: 5 },
//  { type: "insert", value: "World" }]

Delta.transform(a, b, false);
// [{ type: "insert", value: "World" }]

const format = Delta.retain([], 5, { bold: true });
const insert = pipe(
    [],
    Delta.retain(2),
    Delta.insert("XXX")
);

Delta.transform(insert, format);
// [{ type: "retain", value: 8, attributes: { bold: true } }]
```

```ts [data-last]
import { Delta } from "@monstermann/delta";

const a = Delta.insert([], "Hello");
const b = Delta.insert([], "World");

pipe(a, Delta.transform(b, true));
// [{ type: "retain", value: 5 },
//  { type: "insert", value: "World" }]
```

## Op

### length

```ts
function Op.length(op: Op): number
```

Returns the length of a single operation.

For string inserts this is the number of characters. For embed inserts this is always `1`. For retain and remove operations this is the numeric value.

#### Example

```ts
import { Op } from "@monstermann/delta";

Op.length({ type: "insert", value: "Hello" }); // 5
Op.length({ type: "insert", value: { image: "..." } }); // 1
Op.length({ type: "retain", value: 3 }); // 3
Op.length({ type: "remove", value: 2 }); // 2
```
