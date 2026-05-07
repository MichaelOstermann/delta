# length

```ts
function Op.length(op: Op): number
```

Returns the length of a single operation.

For string inserts this is the number of characters. For embed inserts this is always `1`. For retain and remove operations this is the numeric value.

## Example

```ts
import { Op } from "@monstermann/delta";

Op.length({ insert: "Hello" }); // 5
Op.length({ insert: { image: "..." } }); // 1
Op.length({ retain: 3 }); // 3
Op.length({ delete: 2 }); // 2
```
