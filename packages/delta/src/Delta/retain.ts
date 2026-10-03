import type { OpAttributes } from "../OpAttributes"
import { Delta } from "."
import { hasKeys } from "../internals/hasKeys"

/**
 * # retain
 *
 * ```ts
 * function Delta.retain(
 *   ops: Delta,
 *   length: number,
 *   attributes?: OpAttributes | null,
 * ): Delta
 * ```
 *
 * Adds a retain operation to the delta, optionally with attributes to apply formatting.
 *
 * ## Example
 *
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.retain([], 5);
 * // [{ retain: 5 }]
 *
 * Delta.retain([], 5, { bold: true });
 * // [{ retain: 5, attributes: { bold: true } }]
 * ```
 *
 * <!-- prettier-ignore -->
 *
 * ## Removing attributes
 *
 * Use `null` to remove an attribute when composing deltas:
 *
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * const doc = Delta.insert([], "Hello", { bold: true });
 * // [{ insert: "Hello", attributes: { bold: true } }]
 *
 * const removeBold = Delta.retain([], 5, { bold: null });
 * // [{ retain: 5, attributes: { bold: null } }]
 *
 * Delta.compose(doc, removeBold);
 * // [{ insert: "Hello" }]
 * ```
 */
export function retain(
    ops: Delta,
    length: number,
    attributes?: OpAttributes | null,
): Delta {
    if (!Number.isInteger(length)) return ops
    if (length <= 0) return ops
    return Delta.push(ops, {
        attributes: attributes && hasKeys(attributes) ? attributes : undefined,
        retain: length,
    })
}
