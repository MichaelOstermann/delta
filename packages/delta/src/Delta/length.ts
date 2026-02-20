import type { Delta } from "."
import { dfdlT } from "@monstermann/dfdl"
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
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.length(Delta.insert([], "Hello")); // 5
 *
 * Delta.length(pipe(
 *     [],
 *     Delta.insert("Hello"),
 *     Delta.retain(3),
 *     Delta.remove(2)
 * )); // 10
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * pipe([], Delta.insert("Hello"), Delta.length()); // 5
 *
 * pipe(
 *     [],
 *     Delta.insert("Hello"),
 *     Delta.retain(3),
 *     Delta.remove(2),
 *     Delta.length(),
 * ); // 10
 * ```
 *
 */
export const length: {
    (): (ops: Delta) => number
    (ops: Delta): number
} = dfdlT((ops: Delta): number => {
    return ops.reduce((acc, op) => acc + Op.length(op), 0)
}, 1)
