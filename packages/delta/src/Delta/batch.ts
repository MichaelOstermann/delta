import type { Delta } from "."
import type { OpAttributes } from "../OpAttributes"
import { dfdlT } from "@monstermann/dfdl"
import { endMutations, startMutations } from "@monstermann/remmi"

/**
 * # batch
 *
 * ```ts
 * function Delta.batch<T>(
 *   ops: Delta<T>,
 *   transform: (delta: Delta<T>) => Delta<T>,
 * ): Delta<T>
 * ```
 *
 * Batches multiple delta operations together for improved performance.
 *
 * ## Example
 *
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.batch([], (delta) => {
 *     // First change copies:
 *     delta = Delta.insert(delta, "Hello", { bold: true });
 *     // Other changes mutate:
 *     delta = Delta.insert(delta, " world");
 *     return delta;
 * });
 * // [{ type: "insert", value: "Hello", attributes: { bold: true } },
 * //  { type: "insert", value: " world" }]
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * pipe(
 *     [],
 *     Delta.batch((delta) => {
 *         // First change copies:
 *         delta = Delta.insert(delta, "Hello", { bold: true });
 *         // Other changes mutate:
 *         delta = Delta.insert(delta, " world");
 *         return delta;
 *     }),
 * );
 * // [{ type: "insert", value: "Hello", attributes: { bold: true } },
 * //  { type: "insert", value: " world" }]
 * ```
 *
 */
export const batch: {
    <T extends OpAttributes>(
        transform: (delta: Delta<NoInfer<T>>) => Delta<NoInfer<T>>
    ): (ops: Delta<T>) => Delta<T>

    <T extends OpAttributes>(
        ops: Delta<T>,
        transform: (delta: Delta<NoInfer<T>>) => Delta<NoInfer<T>>
    ): Delta<T>
} = dfdlT(<T extends OpAttributes>(
    ops: Delta<T>,
    transform: (delta: Delta<NoInfer<T>>) => Delta<NoInfer<T>>,
): Delta<T> => {
    startMutations()
    try {
        return transform(ops)
    }
    finally {
        endMutations()
    }
}, 2)
