import type { Delta } from "."
import type { OpAttributes } from "../OpAttributes"
import { dfdlT } from "@monstermann/dfdl"
import { OpIterator } from "../OpIterator"

/**
 * # slice
 *
 * ```ts
 * function Delta.slice<T>(ops: Delta<T>, start: number, end?: number): Delta<T>
 * ```
 *
 * Returns a portion of the delta from `start` to `end`.
 *
 * ## Example
 *
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * const delta = Delta.insert([], "Hello world");
 *
 * Delta.slice(delta, 0, 5);
 * // [{ type: "insert", value: "Hello" }]
 *
 * Delta.slice(delta, 6);
 * // [{ type: "insert", value: "world" }]
 *
 * const formatted = pipe(
 *     [],
 *     Delta.insert("Hello", { bold: true }),
 *     Delta.insert(" world", { italic: true }),
 * );
 *
 * Delta.slice(formatted, 3, 8);
 * // [{ type: "insert", value: "lo", attributes: { bold: true } },
 * //  { type: "insert", value: " wo", attributes: { italic: true } }]
 * ```
 *
 * <!-- prettier-ignore -->
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * pipe(
 *     [],
 *     Delta.insert("Hello world"),
 *     Delta.slice(0, 5)
 * );
 * // [{ type: "insert", value: "Hello" }]
 *
 * pipe(
 *     [],
 *     Delta.insert("Hello world"),
 *     Delta.slice(6)
 * );
 * // [{ type: "insert", value: "world" }]
 * ```
 *
 */
export const slice: {
    (
        start: number,
        end?: number,
    ): <T extends OpAttributes>(ops: Delta<T>) => Delta<T>

    <T extends OpAttributes>(
        ops: Delta<T>,
        start: number,
        end?: number,
    ): Delta<T>
} = dfdlT(<T extends OpAttributes>(
    ops: Delta<T>,
    start: number,
    end: number = Infinity,
): Delta<T> => {
    const newOps: Delta<T> = []
    const iter = OpIterator.create(ops)
    let index = 0
    while (index < end && OpIterator.hasNext(iter)) {
        let nextOp
        if (index < start) {
            nextOp = OpIterator.next(iter, start - index)
        }
        else {
            nextOp = OpIterator.next(iter, end - index)
            newOps.push(nextOp)
        }
        index += nextOp.type === "insert" ? nextOp.value.length : nextOp.value
    }
    return newOps
}, args => typeof args[0] !== "number")
