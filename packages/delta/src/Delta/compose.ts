import { dfdlT } from "@monstermann/dfdl"
import { endMutations, markAsMutable, startMutations } from "@monstermann/remmi"
import { Delta } from "."
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
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello");
 * const b = pipe(
 *     [],
 *     Delta.retain(5),
 *     Delta.insert(" world")
 * );
 *
 * Delta.compose(a, b);
 * // [{ insert: "Hello world" }]
 *
 * const format = Delta.retain([], 5, { bold: true });
 *
 * Delta.compose(a, format);
 * // [{ insert: "Hello", attributes: { bold: true } }]
 * ```
 *
 * <!-- prettier-ignore -->
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello");
 * const b = pipe(
 *     [],
 *     Delta.retain(5),
 *     Delta.insert(" world")
 * );
 *
 * pipe(a, Delta.compose(b));
 * // [{ insert: "Hello world" }]
 * ```
 *
 */
export const compose: {
    (b: Delta): (a: Delta) => Delta
    (a: Delta, b: Delta): Delta
} = dfdlT((a: Delta, b: Delta): Delta => {
    const aIter = OpIterator.create(a)
    const bIter = OpIterator.create(b)
    const bHead = OpIterator.peek(bIter)

    startMutations()
    let ops: Delta = markAsMutable([])

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
            ops = Delta.push(ops, OpIterator.next(bIter))
        }
        else if (OpIterator.peekType(aIter) === "delete") {
            ops = Delta.push(ops, OpIterator.next(aIter))
        }
        else {
            const length = Math.min(OpIterator.peekLength(aIter), OpIterator.peekLength(bIter))
            const aOp = OpIterator.next(aIter, length)
            const bOp = OpIterator.next(bIter, length)
            if ("retain" in bOp) {
                if ("retain" in aOp) {
                    ops = Delta.push(ops, {
                        retain: length,
                        attributes: OpAttributes.compose(aOp.attributes, bOp.attributes, true),
                    })
                }
                else if ("insert" in aOp) {
                    ops = Delta.push(ops, {
                        insert: aOp.insert,
                        attributes: OpAttributes.compose(aOp.attributes, bOp.attributes),
                    })
                }
            }
            else if ("delete" in bOp && "retain" in aOp) {
                ops = Delta.push(ops, bOp)
            }
        }
    }

    ops = Delta.chop(ops)
    endMutations()
    return ops
}, 2)
