import type { Delta } from "."
import { Op } from "../Op"

/**
 * # length
 *
 * ```ts
 * function Delta.length(ops: Delta): number
 * ```
 *
 * Returns the total length of the delta (sum of all operation lengths).
 *
 * ## Example
 *
 * <!-- prettier-ignore -->
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.length(Delta.insert([], "Hello")); // 5
 *
 * Delta.length([
 *     { insert: "Hello" },
 *     { retain: 3 },
 *     { delete: 2 },
 * ]); // 10
 * ```
 */
export function length(ops: Delta): number {
    return ops.reduce((acc, op) => acc + Op.length(op), 0)
}
