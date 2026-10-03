import type { Delta } from "."
import { chopOps, pushOp, retainOp } from "../internals/ops"
import { Op } from "../Op"
import { OpAttributes } from "../OpAttributes"
import { OpIterator } from "../OpIterator"

/**
 * # transform
 *
 * ```ts
 * function Delta.transform(
 *   a: Delta,
 *   b: Delta,
 *   priority?: boolean,
 * ): Delta
 * ```
 *
 * Transforms delta `b` to account for delta `a` having been applied first. When both deltas insert at the same position, `priority` determines which insert comes first.
 *
 * ## Example
 *
 * <!-- prettier-ignore -->
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello");
 * const b = Delta.insert([], "World");
 *
 * Delta.transform(a, b, true);
 * // [{ retain: 5 },
 * //  { insert: "World" }]
 *
 * Delta.transform(a, b, false);
 * // [{ insert: "World" }]
 *
 * const format = Delta.retain([], 5, { bold: true });
 * const insert = [
 *     { retain: 2 },
 *     { insert: "XXX" },
 * ];
 *
 * Delta.transform(insert, format);
 * // [{ retain: 8, attributes: { bold: true } }]
 * ```
 */
export function transform(
    a: Delta,
    b: Delta,
    priority: boolean = false,
): Delta {
    const aIter = OpIterator.create(a)
    const bIter = OpIterator.create(b)

    const ops: Delta = []

    while (OpIterator.hasNext(aIter) || OpIterator.hasNext(bIter)) {
        if (
            OpIterator.peekType(aIter) === "insert"
            && (priority || OpIterator.peekType(bIter) !== "insert")
        ) {
            const aOp = OpIterator.next(aIter)
            retainOp(ops, Op.length(aOp))
        }
        else if (OpIterator.peekType(bIter) === "insert") {
            pushOp(ops, OpIterator.next(bIter)!)
        }
        else {
            const length = Math.min(OpIterator.peekLength(aIter), OpIterator.peekLength(bIter))
            const aOp = OpIterator.next(aIter, length)
            const bOp = OpIterator.next(bIter, length)

            if ("delete" in aOp) {
                continue
            }
            if ("delete" in bOp) {
                pushOp(ops, bOp)
            }
            else {
                retainOp(ops, length, OpAttributes.transform(
                    aOp.attributes,
                    bOp.attributes,
                    priority,
                ))
            }
        }
    }

    chopOps(ops)
    return ops
}
