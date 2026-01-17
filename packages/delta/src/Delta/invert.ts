import { dfdlT } from "@monstermann/dfdl"
import { endMutations, markAsMutable, startMutations } from "@monstermann/remmi"
import { Delta } from "."
import { OpAttributes } from "../OpAttributes"

/**
 * # invert
 *
 * ```ts
 * function Delta.invert<T>(a: Delta<T>, b: Delta<T>): Delta<T>
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
    startMutations()
    let newOps: Delta<T> = markAsMutable([])

    let baseIndex = 0
    for (const aOp of a) {
        if (aOp.type === "insert") {
            newOps = Delta.remove(newOps, aOp.value.length)
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
                    const bOpLength = bOp.type === "insert" ? bOp.value.length : bOp.value
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
