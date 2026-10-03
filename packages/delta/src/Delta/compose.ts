import type { Delta } from "."
import { chopOps, pushOp } from "../internals/ops"
import { OpAttributes } from "../OpAttributes"
import { OpIterator } from "../OpIterator"

/**
 * # compose
 *
 * ```ts
 * function Delta.compose(a: Delta, b: Delta): Delta
 * ```
 *
 * Composes two deltas into a single delta that represents applying `a` then `b`.
 *
 * ## Example
 *
 * <!-- prettier-ignore -->
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello");
 * const b = [
 *     { retain: 5 },
 *     { insert: " world" },
 * ];
 *
 * Delta.compose(a, b);
 * // [{ insert: "Hello world" }]
 *
 * const format = Delta.retain([], 5, { bold: true });
 *
 * Delta.compose(a, format);
 * // [{ insert: "Hello", attributes: { bold: true } }]
 * ```
 */
export function compose(a: Delta, b: Delta): Delta {
    const aIter = OpIterator.create(a)
    const bIter = OpIterator.create(b)
    const bHead = OpIterator.peek(bIter)

    const ops: Delta = []

    if (bHead != null && "retain" in bHead && bHead.attributes == null) {
        let bRetain = bHead.retain
        while (
            OpIterator.peekType(aIter) === "insert"
            && OpIterator.peekLength(aIter) <= bRetain
        ) {
            bRetain -= OpIterator.peekLength(aIter)
            ops.push(OpIterator.next(aIter)!)
        }
        if (bHead.retain - bRetain > 0) {
            OpIterator.next(bIter, bHead.retain - bRetain)
        }
    }

    while (OpIterator.hasNext(aIter) || OpIterator.hasNext(bIter)) {
        if (OpIterator.peekType(bIter) === "insert") {
            pushOp(ops, OpIterator.next(bIter))
        }
        else if (OpIterator.peekType(aIter) === "delete") {
            pushOp(ops, OpIterator.next(aIter))
        }
        else {
            const length = Math.min(OpIterator.peekLength(aIter), OpIterator.peekLength(bIter))
            const aOp = OpIterator.next(aIter, length)
            const bOp = OpIterator.next(bIter, length)
            if ("retain" in bOp) {
                if ("retain" in aOp) {
                    pushOp(ops, {
                        attributes: OpAttributes.compose(aOp.attributes, bOp.attributes, true),
                        retain: length,
                    })
                }
                else if ("insert" in aOp) {
                    pushOp(ops, {
                        attributes: OpAttributes.compose(aOp.attributes, bOp.attributes),
                        insert: aOp.insert,
                    })
                }
            }
            else if ("delete" in bOp && "retain" in aOp) {
                pushOp(ops, bOp)
            }
        }
    }

    chopOps(ops)
    return ops
}
