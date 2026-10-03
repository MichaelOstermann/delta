import { Delta } from "."

/**
 * # remove
 *
 * ```ts
 * function Delta.remove(ops: Delta, length: number): Delta
 * ```
 *
 * Adds a remove operation to the delta.
 *
 * ## Example
 *
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.remove([], 5);
 * // [{ delete: 5 }]
 * ```
 */
export function remove(
    ops: Delta,
    length: number,
): Delta {
    if (!Number.isInteger(length)) return ops
    if (length <= 0) return ops
    return Delta.push(ops, { delete: length })
}
