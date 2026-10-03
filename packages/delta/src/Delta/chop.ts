import type { Delta } from "."

/**
 * # chop
 *
 * ```ts
 * function Delta.chop(ops: Delta): Delta
 * ```
 *
 * Removes a trailing retain operation if it has no attributes.
 *
 * ## Example
 *
 * <!-- prettier-ignore -->
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.chop([
 *     { insert: "Hello" },
 *     { retain: 5 },
 * ]);
 * // [{ insert: "Hello" }]
 *
 * Delta.chop([
 *     { insert: "Hello" },
 *     { retain: 5, attributes: { bold: true } },
 * ]);
 * // [{ insert: "Hello" },
 * //  { retain: 5, attributes: { bold: true } }]
 * ```
 */
export function chop(ops: Delta): Delta {
    const lastOp = ops[ops.length - 1]
    if (lastOp != null && "retain" in lastOp && !lastOp.attributes) {
        return ops.slice(0, -1)
    }
    return ops
}
