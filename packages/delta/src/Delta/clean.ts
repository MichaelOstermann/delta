import type { Delta } from "."
import { pushOp } from "../internals/ops"

/**
 * # clean
 *
 * ```ts
 * function Delta.clean(ops: Delta): Delta
 * ```
 *
 * Normalizes the delta by merging consecutive operations of the same type and attributes.
 *
 * ## Example
 *
 * <!-- prettier-ignore -->
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.clean([
 *     { insert: "Hello" },
 *     { insert: " world" },
 * ]);
 * // [{ insert: "Hello world" }]
 *
 * Delta.clean(
 *     [
 *         { insert: "Hello", attributes: { bold: true } },
 *         { insert: " world", attributes: { bold: true } },
 *     ],
 * );
 * // [{ insert: "Hello world", attributes: { bold: true } }]
 * ```
 */
export function clean(ops: Delta): Delta {
    const newOps: Delta = []
    for (const op of ops) pushOp(newOps, op)
    return newOps.length === ops.length ? ops : newOps
}
