import type { OpAttributes } from "../OpAttributes"
import { dfdlT } from "@monstermann/dfdl"
import { endMutations, markAsMutable, startMutations } from "@monstermann/remmi"
import { Delta } from "."

/**
 * # clean
 *
 * ```ts
 * function Delta.clean<T>(ops: Delta<T>): Delta<T>
 * ```
 *
 * Normalizes the delta by merging consecutive operations of the same type and attributes.
 *
 * ## Example
 *
 * <!-- prettier-ignore -->
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.clean(pipe(
 *     [],
 *     Delta.insert("Hello"),
 *     Delta.insert(" world")
 * ));
 * // [{ type: "insert", value: "Hello world" }]
 *
 * Delta.clean(
 *     pipe(
 *         [],
 *         Delta.insert("Hello", { bold: true }),
 *         Delta.insert(" world", { bold: true }),
 *     ),
 * );
 * // [{ type: "insert", value: "Hello world", attributes: { bold: true } }]
 * ```
 *
 * <!-- prettier-ignore -->
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * pipe(
 *     [],
 *     Delta.insert("Hello"),
 *     Delta.insert(" world"),
 *     Delta.clean()
 * );
 * // [{ type: "insert", value: "Hello world" }]
 * ```
 *
 */
export const clean: {
    (): <T extends OpAttributes>(ops: Delta<T>) => Delta<T>
    <T extends OpAttributes>(ops: Delta<T>): Delta<T>
} = dfdlT(<T extends OpAttributes>(ops: Delta<T>): Delta<T> => {
    startMutations()
    let newOps: Delta<T> = markAsMutable([])
    for (const op of ops) newOps = Delta.push(newOps, op)
    endMutations()
    return newOps.length === ops.length ? ops : newOps
}, 1)
