import type { Delta } from "."
import type { OpAttributes } from "../OpAttributes"
import { dfdlT } from "@monstermann/dfdl"

/**
 * # length
 *
 * ```ts
 * function Delta.length<T>(ops: Delta<T>): number
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
    (): <T extends OpAttributes>(ops: Delta<T>) => number
    <T extends OpAttributes>(ops: Delta<T>): number
} = dfdlT(<T extends OpAttributes>(ops: Delta<T>): number => {
    return ops.reduce((acc, op) => {
        return acc + (op.type === "insert" ? op.value.length : op.value)
    }, 0)
}, 1)
