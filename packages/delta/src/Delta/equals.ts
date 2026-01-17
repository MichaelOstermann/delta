import type { Delta } from "."
import { dfdlT } from "@monstermann/dfdl"
import { OpAttributes } from "../OpAttributes"

/**
 * # equals
 *
 * ```ts
 * function Delta.equals<T>(a: Delta<T>, b: Delta<T>): boolean
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
    <T extends OpAttributes>(
        b: Delta<NoInfer<T>>,
    ): (a: Delta<T>) => boolean

    <T extends OpAttributes>(
        a: Delta<T>,
        b: Delta<NoInfer<T>>,
    ): boolean
} = dfdlT(<T extends OpAttributes>(
    a: Delta<T>,
    b: Delta<NoInfer<T>>,
): boolean => {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        const aOp = a[i]!
        const bOp = b[i]!
        if (aOp.type !== bOp.type) return false
        if (aOp.value !== bOp.value) return false
        if (!OpAttributes.isEqual(aOp.attributes, bOp.attributes)) return false
    }
    return true
}, 2)
