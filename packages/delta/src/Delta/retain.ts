import type { OpAttributes } from "../OpAttributes"
import { dfdlT } from "@monstermann/dfdl"
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
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.retain([], 5);
 * // [{ type: "retain", value: 5 }]
 *
 * Delta.retain([], 5, { bold: true });
 * // [{ type: "retain", value: 5, attributes: { bold: true } }]
 * ```
 *
 * <!-- prettier-ignore -->
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * pipe([], Delta.retain(5));
 * // [{ type: "retain", value: 5 }]
 *
 * pipe(
 *     [],
 *     Delta.retain(3),
 *     Delta.retain(2, { italic: true })
 * );
 * // [{ type: "retain", value: 3 },
 * //  { type: "retain", value: 2, attributes: { italic: true } }]
 * ```
 *
 * ## Removing attributes
 *
 * Use `null` to remove an attribute when composing deltas:
 *
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * const doc = Delta.insert([], "Hello", { bold: true });
 * // [{ type: "insert", value: "Hello", attributes: { bold: true } }]
 *
 * const removeBold = Delta.retain([], 5, { bold: null });
 * // [{ type: "retain", value: 5, attributes: { bold: null } }]
 *
 * Delta.compose(doc, removeBold);
 * // [{ type: "insert", value: "Hello" }]
 * ```
 *
 */
export const retain: {
    (
        length: number,
        attributes?: OpAttributes | null,
    ): (ops: Delta) => Delta

    (
        ops: Delta,
        length: number,
        attributes?: OpAttributes | null,
    ): Delta
} = dfdlT((
    ops: Delta,
    length: number,
    attributes?: OpAttributes,
): Delta => {
    if (!Number.isInteger(length)) return ops
    if (length <= 0) return ops
    return Delta.push(ops, {
        attributes: attributes && hasKeys(attributes) ? attributes : undefined,
        type: "retain",
        value: length,
    })
}, args => typeof args[0] !== "number")
