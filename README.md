<div align="center">

<h1>delta</h1>

**Functional operational-transform.**

</div>

## Differences from quill-delta

This library has been largely ported from [quill-delta](https://github.com/slab/delta), some differences:

- Immutable, functions take and return plain arrays
- Support for nested attributes has been removed
- Cloning is only done when the data actually changes
- Deep-cloning has been replaced with shallow-cloning
- One dependency, [fast-diff](https://github.com/jhchen/fast-diff)

## Example

```ts
import { Delta } from "@monstermann/delta";

// Create a document
const doc = Delta.insert([], "Hello world");

// Create a change that makes "Hello" bold
const change = Delta.retain([], 5, { bold: true });

// Apply the change
const result = Delta.compose(doc, change);
// [{ insert: "Hello", attributes: { bold: true } },
//  { insert: " world" }]

// Compute the difference between two documents
const a = Delta.insert([], "Hello");
const b = Delta.insert([], "Hello world");

Delta.diff(a, b);
// [{ retain: 5 },
//  { insert: " world" }]
```

## Installation

```sh
bun add @monstermann/delta
```

## API

Everything is documented with JSDoc, including examples.

|         |                                                                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `Delta` | `insert`, `retain`, `remove`, `push`, `compose`, `transform`, `invert`, `diff`, `concat`, `slice`, `chop`, `clean`, `equals`, `length` |
| `Op`    | `length`                                                                                                                               |
