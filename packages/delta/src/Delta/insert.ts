import type { EmbedValue } from "../Op"
import type { OpAttributes } from "../OpAttributes"
import { Delta } from "."
import { hasKeys } from "../internals/hasKeys"

/**
 * # insert
 *
 * ```ts
 * function Delta.insert(
 *   ops: Delta,
 *   content: string | EmbedValue,
 *   attributes?: OpAttributes | null,
 * ): Delta
 * ```
 *
 * Adds an insert operation to the delta.
 *
 * ## Example
 *
 * ```ts
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.insert([], "Hello");
 * // [{ insert: "Hello" }]
 *
 * Delta.insert([], "Hello", { bold: true });
 * // [{ insert: "Hello", attributes: { bold: true } }]
 * ```
 */
export function insert(
    ops: Delta,
    content: string | EmbedValue,
    attributes?: OpAttributes | null,
): Delta {
    if (typeof content === "string" && !content.length) return ops
    return Delta.push(ops, {
        attributes: attributes && hasKeys(attributes) ? attributes : undefined,
        insert: content,
    })
}
