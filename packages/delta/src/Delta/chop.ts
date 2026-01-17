import type { Delta } from "."
import type { OpAttributes } from "../OpAttributes"
import { dfdlT } from "@monstermann/dfdl"
import { cloneArray } from "@monstermann/remmi"

/**
 * # chop
 *
 * ```ts
 * function Delta.chop<T>(ops: Delta<T>): Delta<T>
 * ```
 *
 * Removes a trailing retain operation if it has no attributes.
 *
 * ## Example
 *
 * <!-- prettier-ignore -->
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.chop(pipe(
 *     [],
 *     Delta.insert("Hello"),
 *     Delta.retain(5)
 * ));
 * // [{ type: "insert", value: "Hello" }]
 *
 * Delta.chop(pipe(
 *     [],
 *     Delta.insert("Hello"),
 *     Delta.retain(5, { bold: true })
 * ));
 * // [{ type: "insert", value: "Hello" },
 * //  { type: "retain", value: 5, attributes: { bold: true } }]
 * ```
 *
 * <!-- prettier-ignore -->
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * pipe(
 *     [],
 *     Delta.insert("Hello"),
 *     Delta.retain(5),
 *     Delta.chop()
 * );
 * // [{ type: "insert", value: "Hello" }]
 * ```
 *
 */
export const chop: {
    (): <T extends OpAttributes>(ops: Delta<T>) => Delta<T>
    <T extends OpAttributes>(ops: Delta<T>): Delta<T>
} = dfdlT(<T extends OpAttributes>(ops: Delta<T>): Delta<T> => {
    const lastOp = ops[ops.length - 1]
    if (lastOp?.type === "retain" && !lastOp.attributes) {
        ops = cloneArray(ops)
        ops.pop()
    }
    return ops
}, 1)
