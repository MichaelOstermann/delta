import type { Delta } from "."
import { dfdlT } from "@monstermann/dfdl"
import { endMutations, startMutations } from "@monstermann/remmi"

/**
 * # batch
 *
 * ```ts
 * function Delta.batch(
 *   ops: Delta,
 *   transform: (delta: Delta) => Delta,
 * ): Delta
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
    (transform: (delta: Delta) => Delta): (ops: Delta) => Delta
    (ops: Delta, transform: (delta: Delta) => Delta): Delta
} = dfdlT((
    ops: Delta,
    transform: (delta: Delta) => Delta,
): Delta => {
    startMutations()
    try {
        return transform(ops)
    }
    finally {
        endMutations()
    }
}, 2)
