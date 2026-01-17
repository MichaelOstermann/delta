---
aside: true
---

# delta

<Badge type="info" class="size">
    <span>Minified</span>
    <span>16.09 KB</span>
</Badge>

<Badge type="info" class="size">
    <span>Minzipped</span>
    <span>5.15 KB</span>
</Badge>

**Functional operational-transform.**

> [!WARNING]
> Due to the many footguns and pitalls present in collaborative applications based on operational transform, this library should only be used for ad-hoc string manipulation. Please consider using [conflict-free replicated data types](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) for serious applications.

## Differences from quill-delta

This library has been largely ported from [quill-delta](https://github.com/slab/delta), some differences:

- Immutable with optional transient mutations
- Functional data-first/data-last API acting upon plain arrays
- Higher fidelity type definitions
- Operations have been migrated to a monomorphic, tagged union
- The `delete` operation has been renamed to `remove`, as `delete` is a reserved keyword
- Support for embeds has been removed
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

::: code-group

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

:::
