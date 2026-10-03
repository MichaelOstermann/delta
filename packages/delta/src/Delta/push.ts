import type { Delta } from "."
import type { Op } from "../Op"
import { pushOp } from "../internals/ops"

/**
 * # push
 *
 * ```ts
 * function Delta.push(ops: Delta, op: Op): Delta
 * ```
 *
 * Pushes an operation onto the delta, merging with the previous operation if possible.
 *
 * ## Example
 *
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.push([], { insert: "Hello" });
 * // [{ insert: "Hello" }]
 *
 * Delta.push(Delta.push([], { insert: "Hello" }), { insert: " world" });
 * // [{ insert: "Hello world" }]
 * ```
 */
export function push(ops: Delta, op: Op): Delta {
    if (!ops.length) return [op]
    const copy = ops.slice()
    pushOp(copy, op)
    return copy
}
