import type { Delta } from "."
import { dfdlT } from "@monstermann/dfdl"
import { isEqual } from "../internals/isEqual"

/**
 * # equals
 *
 * ```ts
 * function Delta.equals(a: Delta, b: Delta): boolean
 * ```
 *
 * Checks if two deltas are equal by comparing their operations and attributes.
 *
 * ## Example
 *
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello", { bold: true });
 * const b = Delta.insert([], "Hello", { bold: true });
 * const c = Delta.insert([], "Hello", { italic: true });
 *
 * Delta.equals(a, b); // true
 * Delta.equals(a, c); // false
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello", { bold: true });
 * const b = Delta.insert([], "Hello", { bold: true });
 *
 * pipe(a, Delta.equals(b)); // true
 * ```
 *
 */
export const equals: {
    (b: Delta): (a: Delta) => boolean
    (a: Delta, b: Delta): boolean
} = dfdlT((a: Delta, b: Delta): boolean => {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        const aOp = a[i]!
        const bOp = b[i]!
        if ("insert" in aOp && "insert" in bOp) {
            if (aOp.insert !== bOp.insert) return false
            if (!isEqual(aOp.attributes, bOp.attributes)) return false
        }
        else if ("retain" in aOp && "retain" in bOp) {
            if (aOp.retain !== bOp.retain) return false
            if (!isEqual(aOp.attributes, bOp.attributes)) return false
        }
        else if ("delete" in aOp && "delete" in bOp) {
            if (aOp.delete !== bOp.delete) return false
        }
        else {
            return false
        }
    }
    return true
}, 2)
