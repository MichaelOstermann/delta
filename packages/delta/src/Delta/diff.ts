import { dfdlT } from "@monstermann/dfdl"
import { endMutations, markAsMutable, startMutations } from "@monstermann/remmi"
import fastDiff from "fast-diff"
import { Delta } from "."
import { isEqual } from "../internals/isEqual"
import { OpAttributes } from "../OpAttributes"
import { OpIterator } from "../OpIterator"

// Embeds are collapsed to a single placeholder character for fast-diff.
// Note: string inserts containing \0 would be misidentified — avoid \0 in text content.
const NULL_CHARACTER = "\0"

/**
 * # diff
 *
 * ```ts
 * function Delta.diff(a: Delta, b: Delta, cursor?: number): Delta
 * ```
 *
 * Computes the difference between two document deltas, returning a delta that transforms `a` into `b`.
 *
 * The optional `cursor` parameter provides a hint about where the user's cursor is positioned. This helps produce more intuitive diffs when there are multiple valid ways to represent the same change.
 *
 * ## Example
 *
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello");
 * const b = Delta.insert([], "Hello world");
 *
 * Delta.diff(a, b);
 * // [{ retain: 5 },
 * //  { insert: " world" }]
 *
 * const plain = Delta.insert([], "Hello");
 * const bold = Delta.insert([], "Hello", { bold: true });
 *
 * Delta.diff(plain, bold);
 * // [{ retain: 5, attributes: { bold: true } }]
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello");
 * const b = Delta.insert([], "Hello world");
 *
 * pipe(a, Delta.diff(b));
 * // [{ retain: 5 },
 * //  { insert: " world" }]
 * ```
 *
 * ## Cursor hint
 *
 * When text changes are ambiguous, the cursor position determines where the change is placed:
 *
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "foo");
 * const b = Delta.insert([], "foo bar foo");
 *
 * // cursor=3: user typed " bar foo" at the end
 * Delta.diff(a, b, 3);
 * // [{ retain: 3 },
 * //  { insert: " bar foo" }]
 *
 * // cursor=0: user typed "foo bar " at the beginning
 * Delta.diff(a, b, 0);
 * // [{ insert: "foo bar " }]
 * ```
 *
 */
export const diff: {
    (b: Delta, cursor?: number): (a: Delta) => Delta
    (a: Delta, b: Delta, cursor?: number): Delta
} = dfdlT((
    a: Delta,
    b: Delta,
    cursor?: number,
): Delta => {
    if (a === b) return []

    const aString = toText(a, "Delta.diff(a, b): a is not a document")
    const bString = toText(b, "Delta.diff(a, b): b is not a document")

    startMutations()
    let ops: Delta = markAsMutable([])
    const diffResult = fastDiff(aString, bString, cursor, true)
    const aIter = OpIterator.create(a)
    const bIter = OpIterator.create(b)

    for (const component of diffResult) {
        const [type, text] = component
        let length = text.length

        while (length > 0) {
            let opLength = 0

            if (type === fastDiff.INSERT) {
                opLength = Math.min(OpIterator.peekLength(bIter), length)
                ops = Delta.push(ops, OpIterator.next(bIter, opLength)!)
            }
            else if (type === fastDiff.DELETE) {
                opLength = Math.min(length, OpIterator.peekLength(aIter))
                OpIterator.next(aIter, opLength)
                ops = Delta.remove(ops, opLength)
            }
            else if (type === fastDiff.EQUAL) {
                opLength = Math.min(
                    OpIterator.peekLength(aIter),
                    OpIterator.peekLength(bIter),
                    length,
                )
                const aOp = OpIterator.next(aIter, opLength)
                const bOp = OpIterator.next(bIter, opLength)
                const valuesEqual = "insert" in aOp && "insert" in bOp && (
                    aOp.insert === bOp.insert
                    || (
                        typeof aOp.insert === "object" && typeof bOp.insert === "object"
                        && isEqual(aOp.insert, bOp.insert)
                    )
                )
                if (valuesEqual) {
                    ops = Delta.retain(
                        ops,
                        opLength,
                        OpAttributes.diff(aOp.attributes, bOp.attributes),
                    )
                }
                else {
                    ops = Delta.push(ops, bOp!)
                    ops = Delta.remove(ops, opLength)
                }
            }

            length -= opLength
        }
    }

    ops = Delta.chop(ops)
    endMutations()
    return ops
}, (args) => {
    return Array.isArray(args[0]) && Array.isArray(args[1])
})

function toText(ops: Delta, errMsg: string): string {
    return ops.map((op) => {
        if ("insert" in op) return typeof op.insert === "string" ? op.insert : NULL_CHARACTER
        throw new Error(errMsg)
    }).join("")
}
