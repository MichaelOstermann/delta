import type { OpAttributes } from "../OpAttributes"
import { dfdlT } from "@monstermann/dfdl"
import { Delta } from "."

/**
 * # remove
 *
 * ```ts
 * function Delta.remove<T>(ops: Delta<T>, length: number): Delta<T>
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
    <T extends OpAttributes>(
        length: number,
    ): (ops: Delta<T>) => Delta<T>

    <T extends OpAttributes>(
        ops: Delta<T>,
        length: number,
    ): Delta<T>
} = dfdlT(<T extends OpAttributes>(
    ops: Delta<T>,
    length: number,
): Delta<T> => {
    if (!Number.isInteger(length)) return ops
    if (length <= 0) return ops
    return Delta.push(ops, { attributes: undefined, type: "remove", value: length })
}, 2)
