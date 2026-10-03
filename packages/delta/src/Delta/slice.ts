import type { Delta } from "."
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
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * const delta = Delta.insert([], "Hello world");
 *
 * Delta.slice(delta, 0, 5);
 * // [{ insert: "Hello" }]
 *
 * Delta.slice(delta, 6);
 * // [{ insert: "world" }]
 *
 * const formatted = [
 *     { insert: "Hello", attributes: { bold: true } },
 *     { insert: " world", attributes: { italic: true } },
 * ];
 *
 * Delta.slice(formatted, 3, 8);
 * // [{ insert: "lo", attributes: { bold: true } },
 * //  { insert: " wo", attributes: { italic: true } }]
 * ```
 */
export function slice(
    ops: Delta,
    start: number,
    end: number = Infinity,
): Delta {
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
}
