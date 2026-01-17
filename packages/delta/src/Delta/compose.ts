import { dfdlT } from "@monstermann/dfdl"
import { endMutations, markAsMutable, startMutations } from "@monstermann/remmi"
import { Delta } from "."
import { OpAttributes } from "../OpAttributes"
import { OpIterator } from "../OpIterator"

/**
 * # compose
 *
 * ```ts
 * function Delta.compose<T>(a: Delta<T>, b: Delta<T>): Delta<T>
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
 * // [{ type: "insert", value: "Hello world" }]
 *
 * const format = Delta.retain([], 5, { bold: true });
 *
 * Delta.compose(a, format);
 * // [{ type: "insert", value: "Hello", attributes: { bold: true } }]
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
 * // [{ type: "insert", value: "Hello world" }]
 * ```
 *
 */
export const compose: {
    <T extends OpAttributes>(
        b: Delta<NoInfer<T>>,
    ): (a: Delta<T>) => Delta<T>

    <T extends OpAttributes>(
        a: Delta<T>,
        b: Delta<NoInfer<T>>,
    ): Delta<T>
} = dfdlT(<T extends OpAttributes>(
    a: Delta<T>,
    b: Delta<NoInfer<T>>,
): Delta<T> => {
    const aIter = OpIterator.create(a)
    const bIter = OpIterator.create(b)
    const bHead = OpIterator.peek(bIter)

    startMutations()
    let ops: Delta<T> = markAsMutable([])

    if (bHead?.type === "retain" && bHead.attributes == null) {
        let bRetain = bHead.value
        while (
            OpIterator.peekType(aIter) === "insert"
            && OpIterator.peekLength(aIter) <= bRetain
        ) {
            bRetain -= OpIterator.peekLength(aIter)
            ops.push(OpIterator.next(aIter)!)
        }
        if (bHead.value - bRetain > 0) {
            OpIterator.next(bIter, bHead.value - bRetain)
        }
    }

    while (OpIterator.hasNext(aIter) || OpIterator.hasNext(bIter)) {
        if (OpIterator.peekType(bIter) === "insert") {
            ops = Delta.push(ops, OpIterator.next(bIter))
        }
        else if (OpIterator.peekType(aIter) === "remove") {
            ops = Delta.push(ops, OpIterator.next(aIter))
        }
        else {
            const length = Math.min(OpIterator.peekLength(aIter), OpIterator.peekLength(bIter))
            const aOp = OpIterator.next(aIter, length)
            const bOp = OpIterator.next(bIter, length)
            if (bOp.type === "retain") {
                if (aOp.type === "retain") {
                    ops = Delta.push(ops, {
                        attributes: OpAttributes.compose(aOp.attributes, bOp.attributes, true),
                        type: "retain",
                        value: length,
                    })
                }
                else if (aOp.type === "insert") {
                    ops = Delta.push(ops, {
                        attributes: OpAttributes.compose(aOp.attributes, bOp.attributes),
                        type: "insert",
                        value: aOp.value,
                    })
                }
            }
            else if (bOp.type === "remove" && aOp.type === "retain") {
                ops = Delta.push(ops, bOp)
            }
        }
    }

    ops = Delta.chop(ops)
    endMutations()
    return ops
}, 2)
