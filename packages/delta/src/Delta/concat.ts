import type { OpAttributes } from "../OpAttributes"
import { dfdlT } from "@monstermann/dfdl"
import { Delta } from "."

/**
 * # concat
 *
 * ```ts
 * function Delta.concat<T>(a: Delta<T>, b: Delta<T>): Delta<T>
 * ```
 *
 * Concatenates two deltas together, merging adjacent operations if possible.
 *
 * ## Example
 *
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello");
 * const b = Delta.insert([], " world");
 *
 * Delta.concat(a, b);
 * // [{ type: "insert", value: "Hello world" }]
 *
 * const bold = Delta.insert([], "Hello", { bold: true });
 * const italic = Delta.insert([], " world", { italic: true });
 *
 * Delta.concat(bold, italic);
 * // [{ type: "insert", value: "Hello", attributes: { bold: true } },
 * //  { type: "insert", value: " world", attributes: { italic: true } }]
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * const a = Delta.insert([], "Hello");
 * const b = Delta.insert([], " world");
 *
 * pipe(a, Delta.concat(b));
 * // [{ type: "insert", value: "Hello world" }]
 * ```
 *
 */
export const concat: {
    <T extends OpAttributes>(b: Delta<NoInfer<T>>): (a: Delta<T>) => Delta<T>
    <T extends OpAttributes>(a: Delta<T>, b: Delta<NoInfer<T>>): Delta<T>
} = dfdlT(<T extends OpAttributes>(a: Delta<T>, b: Delta<NoInfer<T>>): Delta<T> => {
    if (!b.length) return a
    if (!a.length) return b
    return Delta.push(a, b[0]!).concat(b.slice(1))
}, 2)
