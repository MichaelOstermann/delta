import type { Delta } from "."
import { chopOps, pushOp, removeOp, retainOp } from "../internals/ops"
import { Op } from "../Op"
import { OpAttributes } from "../OpAttributes"
import { OpIterator } from "../OpIterator"

/**
 * # invert
 *
 * ```ts
 * function Delta.invert(a: Delta, b: Delta): Delta
 * ```
 *
 * Returns the inverse of a delta against a base document. Applying the inverted delta undoes the original change.
 *
 * ## Example
 *
 * <!-- prettier-ignore -->
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * const base = Delta.insert([], "Hello");
 * const change = Delta.retain([], 5, { bold: true });
 *
 * Delta.invert(change, base);
 * // [{ retain: 5, attributes: { bold: null } }]
 *
 * const insert = [
 *     { retain: 5 },
 *     { insert: " world" },
 * ];
 *
 * Delta.invert(insert, base);
 * // [{ retain: 5 },
 * //  { delete: 6 }]
 * ```
 */
export function invert(
    a: Delta,
    b: Delta,
): Delta {
    const newOps: Delta = []
    const bIter = OpIterator.create(b)

    for (const aOp of a) {
        if ("insert" in aOp) {
            removeOp(newOps, Op.length(aOp))
            continue
        }

        let length = Op.length(aOp)
        if ("retain" in aOp && aOp.attributes == null) retainOp(newOps, length)

        while (length > 0 && OpIterator.hasNext(bIter)) {
            const bOp = OpIterator.next(bIter, length)
            const bOpLength = Op.length(bOp)
            length -= bOpLength
            if ("delete" in aOp) {
                pushOp(newOps, bOp)
            }
            else if (aOp.attributes) {
                retainOp(newOps, bOpLength, OpAttributes.invert(aOp.attributes, bOp.attributes))
            }
        }
    }

    chopOps(newOps)
    return newOps
}
