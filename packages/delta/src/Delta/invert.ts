import { dfdlT } from "@monstermann/dfdl"
import { endMutations, markAsMutable, startMutations } from "@monstermann/remmi"
import { Delta } from "."
import { Op } from "../Op"
import { OpAttributes } from "../OpAttributes"

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
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * const base = Delta.insert([], "Hello");
 * const change = Delta.retain([], 5, { bold: true });
 *
 * Delta.invert(change, base);
 * // [{ retain: 5, attributes: { bold: null } }]
 *
 * const insert = pipe(
 *     [],
 *     Delta.retain(5),
 *     Delta.insert(" world")
 * );
 *
 * Delta.invert(insert, base);
 * // [{ retain: 5 },
 * //  { delete: 6 }]
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * const base = Delta.insert([], "Hello");
 * const change = Delta.retain([], 5, { bold: true });
 *
 * pipe(change, Delta.invert(base));
 * // [{ retain: 5, attributes: { bold: null } }]
 * ```
 *
 */
export const invert: {
    (b: Delta): (a: Delta) => Delta
    (a: Delta, b: Delta): Delta
} = dfdlT((
    a: Delta,
    b: Delta,
): Delta => {
    startMutations()
    let newOps: Delta = markAsMutable([])

    let baseIndex = 0
    for (const aOp of a) {
        if ("insert" in aOp) {
            newOps = Delta.remove(newOps, Op.length(aOp))
        }
        else if ("retain" in aOp && aOp.attributes == null) {
            newOps = Delta.retain(newOps, aOp.retain)
            baseIndex += aOp.retain
        }
        else {
            const length = "retain" in aOp ? aOp.retain : aOp.delete
            for (const bOp of Delta.slice(b, baseIndex, baseIndex + length)) {
                if ("delete" in aOp) {
                    newOps = Delta.push(newOps, bOp)
                }
                else if (aOp.attributes) {
                    const bOpLength = Op.length(bOp)
                    newOps = Delta.retain(newOps, bOpLength, OpAttributes.invert(aOp.attributes, bOp.attributes))
                }
            }
            baseIndex += length
        }
    }

    newOps = Delta.chop(newOps)
    endMutations()
    return newOps
}, 2)
