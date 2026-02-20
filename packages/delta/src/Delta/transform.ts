import { dfdlT } from "@monstermann/dfdl"
import { endMutations, markAsMutable, startMutations } from "@monstermann/remmi"
import { Delta } from "."
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
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello");
 * const b = Delta.insert([], "World");
 *
 * Delta.transform(a, b, true);
 * // [{ type: "retain", value: 5 },
 * //  { type: "insert", value: "World" }]
 *
 * Delta.transform(a, b, false);
 * // [{ type: "insert", value: "World" }]
 *
 * const format = Delta.retain([], 5, { bold: true });
 * const insert = pipe(
 *     [],
 *     Delta.retain(2),
 *     Delta.insert("XXX")
 * );
 *
 * Delta.transform(insert, format);
 * // [{ type: "retain", value: 8, attributes: { bold: true } }]
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello");
 * const b = Delta.insert([], "World");
 *
 * pipe(a, Delta.transform(b, true));
 * // [{ type: "retain", value: 5 },
 * //  { type: "insert", value: "World" }]
 * ```
 *
 */
export const transform: {
    (b: Delta, priority?: boolean): (a: Delta) => Delta
    (a: Delta, b: Delta, priority?: boolean): Delta
} = dfdlT((
    a: Delta,
    b: Delta,
    priority: boolean = false,
): Delta => {
    const aIter = OpIterator.create(a)
    const bIter = OpIterator.create(b)

    startMutations()
    let ops: Delta = markAsMutable([])

    while (OpIterator.hasNext(aIter) || OpIterator.hasNext(bIter)) {
        if (
            OpIterator.peekType(aIter) === "insert"
            && (priority || OpIterator.peekType(bIter) !== "insert")
        ) {
            const aOp = OpIterator.next(aIter)
            ops = Delta.retain(ops, Op.length(aOp))
        }
        else if (OpIterator.peekType(bIter) === "insert") {
            ops = Delta.push(ops, OpIterator.next(bIter)!)
        }
        else {
            const length = Math.min(OpIterator.peekLength(aIter), OpIterator.peekLength(bIter))
            const aOp = OpIterator.next(aIter, length)
            const bOp = OpIterator.next(bIter, length)

            if (aOp.type === "remove") {
                continue
            }
            if (bOp.type === "remove") {
                ops = Delta.push(ops, bOp)
            }
            else {
                ops = Delta.retain(
                    ops,
                    length,
                    OpAttributes.transform(
                        aOp.attributes,
                        bOp.attributes,
                        priority,
                    ),
                )
            }
        }
    }

    ops = Delta.chop(ops)
    endMutations()
    return ops
}, (args) => {
    return Array.isArray(args[0]) && Array.isArray(args[1])
})
