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
 * // [{ type: "retain", value: 5, attributes: { bold: null } }]
 *
 * const insert = pipe(
 *     [],
 *     Delta.retain(5),
 *     Delta.insert(" world")
 * );
 *
 * Delta.invert(insert, base);
 * // [{ type: "retain", value: 5 },
 * //  { type: "remove", value: 6 }]
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * const base = Delta.insert([], "Hello");
 * const change = Delta.retain([], 5, { bold: true });
 *
 * pipe(change, Delta.invert(base));
 * // [{ type: "retain", value: 5, attributes: { bold: null } }]
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
        if (aOp.type === "insert") {
            newOps = Delta.remove(newOps, Op.length(aOp))
        }
        else if (aOp.type === "retain" && aOp.attributes == null) {
            newOps = Delta.retain(newOps, aOp.value)
            baseIndex += aOp.value
        }
        else {
            const length = aOp.value
            for (const bOp of Delta.slice(b, baseIndex, baseIndex + length)) {
                if (aOp.type === "remove") {
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
