import type { EmbedValue } from "../Op"
import type { OpAttributes } from "../OpAttributes"
import { dfdlT } from "@monstermann/dfdl"
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
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.insert([], "Hello");
 * // [{ type: "insert", value: "Hello" }]
 *
 * Delta.insert([], "Hello", { bold: true });
 * // [{ type: "insert", value: "Hello", attributes: { bold: true } }]
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * pipe([], Delta.insert("Hello"));
 * // [{ type: "insert", value: "Hello" }]
 *
 * pipe(
 *     [],
 *     Delta.insert("Hello", { bold: true }),
 *     Delta.insert(" world", { italic: true }),
 * );
 * // [{ type: "insert", value: "Hello", attributes: { bold: true } },
 * //  { type: "insert", value: " world", attributes: { italic: true } }]
 * ```
 *
 */
export const insert: {
    (
        content: string | EmbedValue,
        attributes?: OpAttributes | null,
    ): (ops: Delta) => Delta

    (
        ops: Delta,
        content: string | EmbedValue,
        attributes?: OpAttributes | null,
    ): Delta
} = dfdlT((
    ops: Delta,
    content: string | EmbedValue,
    attributes?: OpAttributes,
): Delta => {
    if (typeof content === "string" && !content.length) return ops
    return Delta.push(ops, {
        attributes: attributes && hasKeys(attributes) ? attributes : undefined,
        type: "insert",
        value: content,
    })
}, args => Array.isArray(args[0]))
