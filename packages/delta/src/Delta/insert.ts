import type { NullableOpAttributes, OpAttributes } from "../OpAttributes"
import { dfdlT } from "@monstermann/dfdl"
import { Delta } from "."
import { hasKeys } from "../internals/hasKeys"

/**
 * # insert
 *
 * ```ts
 * function Delta.insert<T>(
 *   ops: Delta<T>,
 *   content: string,
 *   attributes?: T | null,
 * ): Delta<T>
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
    <T extends OpAttributes>(
        content: string,
        attributes?: NullableOpAttributes<NoInfer<T>> | null,
    ): (ops: Delta<T>) => Delta<T>

    <T extends OpAttributes>(
        ops: Delta<T>,
        content: string,
        attributes?: NullableOpAttributes<NoInfer<T>> | null,
    ): Delta<T>
} = dfdlT(<T extends OpAttributes>(
    ops: Delta<T>,
    content: string,
    attributes?: NullableOpAttributes<NoInfer<T>>,
): Delta<T> => {
    if (!content.length) return ops
    return Delta.push(ops, {
        attributes: attributes && hasKeys(attributes) ? attributes : undefined,
        type: "insert",
        value: content,
    })
}, args => typeof args[0] !== "string")
