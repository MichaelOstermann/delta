import type { Op } from "./types"

/**
 * # length
 *
 * ```ts
 * function Op.length(op: Op): number
 * ```
 *
 * Returns the length of a single operation.
 *
 * For string inserts this is the number of characters. For embed inserts this
 * is always `1`. For retain and remove operations this is the numeric value.
 *
 * ## Example
 *
 * ```ts
 * import { Op } from "@monstermann/delta";
 *
 * Op.length({ type: "insert", value: "Hello" }); // 5
 * Op.length({ type: "insert", value: { image: "..." } }); // 1
 * Op.length({ type: "retain", value: 3 }); // 3
 * Op.length({ type: "remove", value: 2 }); // 2
 * ```
 *
 */
export function length(op: Op): number {
    if (op.type === "insert") return typeof op.value === "string" ? op.value.length : 1
    return op.value
}
