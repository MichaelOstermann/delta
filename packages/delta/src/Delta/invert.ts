import { Delta } from "."
import { chopOps, pushOp, removeOp, retainOp } from "../internals/ops"
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

    let baseIndex = 0
    for (const aOp of a) {
        if ("insert" in aOp) {
            removeOp(newOps, Op.length(aOp))
        }
        else if ("retain" in aOp && aOp.attributes == null) {
            retainOp(newOps, aOp.retain)
            baseIndex += aOp.retain
        }
        else {
            const length = "retain" in aOp ? aOp.retain : aOp.delete
            for (const bOp of Delta.slice(b, baseIndex, baseIndex + length)) {
                if ("delete" in aOp) {
                    pushOp(newOps, bOp)
                }
                else if (aOp.attributes) {
                    const bOpLength = Op.length(bOp)
                    retainOp(newOps, bOpLength, OpAttributes.invert(aOp.attributes, bOp.attributes))
                }
            }
            baseIndex += length
        }
    }

    chopOps(newOps)
    return newOps
}
