import { dfdlT } from "@monstermann/dfdl"
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
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.remove([], 5);
 * // [{ type: "remove", value: 5 }]
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * pipe([], Delta.remove(5));
 * // [{ type: "remove", value: 5 }]
 *
 * pipe([], Delta.retain(3), Delta.remove(5));
 * // [{ type: "retain", value: 3 },
 * //  { type: "remove", value: 5 }]
 * ```
 *
 */
export const remove: {
    (length: number): (ops: Delta) => Delta
    (ops: Delta, length: number): Delta
} = dfdlT((
    ops: Delta,
    length: number,
): Delta => {
    if (!Number.isInteger(length)) return ops
    if (length <= 0) return ops
    return Delta.push(ops, { attributes: undefined, type: "remove", value: length })
}, 2)
