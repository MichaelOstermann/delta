import type { Delta } from "."
import { dfdlT } from "@monstermann/dfdl"
import { Op } from "../Op"
import { OpIterator } from "../OpIterator"

/**
 * # slice
 *
 * ```ts
 * function Delta.slice(ops: Delta, start: number, end?: number): Delta
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
    (start: number, end?: number): (ops: Delta) => Delta
    (ops: Delta, start: number, end?: number): Delta
} = dfdlT((
    ops: Delta,
    start: number,
    end: number = Infinity,
): Delta => {
    const newOps: Delta = []
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
        index += Op.length(nextOp)
    }
    return newOps
}, args => typeof args[0] !== "number")
