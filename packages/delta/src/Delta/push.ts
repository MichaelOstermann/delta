import type { Delta } from "."
import type { Op } from "../Op"
import { dfdlT } from "@monstermann/dfdl"
import { cloneArray, endMutations, startMutations } from "@monstermann/remmi"
import { isEqual } from "../internals/isEqual"

/**
 * # push
 *
 * ```ts
 * function Delta.push(ops: Delta, op: Op): Delta
 * ```
 *
 * Pushes an operation onto the delta, merging with the previous operation if possible.
 *
 * ## Example
 *
 * ```ts [data-first]
 * import { Delta } from "@monstermann/delta";
 *
 * Delta.push([], { insert: "Hello" });
 * // [{ insert: "Hello" }]
 *
 * Delta.push(Delta.push([], { insert: "Hello" }), { insert: " world" });
 * // [{ insert: "Hello world" }]
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * pipe([], Delta.push({ insert: "Hello" }));
 * // [{ insert: "Hello" }]
 *
 * pipe(
 *     [],
 *     Delta.push({ insert: "Hello" }),
 *     Delta.push({ insert: " world" }),
 * );
 * // [{ insert: "Hello world" }]
 * ```
 *
 */
export const push: {
    (op: Op): (ops: Delta) => Delta
    (ops: Delta, op: Op): Delta
} = dfdlT((
    ops: Delta,
    op: Op,
): Delta => {
    if (!ops.length) return [op]

    const length = ops.length
    const lastOp = ops[length - 1]!
    let copy = cloneArray(ops)

    if ("delete" in lastOp && "delete" in op) {
        copy[length - 1] = { delete: lastOp.delete + op.delete }
        return copy
    }

    // Since it does not matter if we insert before or after deleting at the same index,
    // always prefer to insert first.
    if ("delete" in lastOp && "insert" in op) {
        startMutations()
        copy.pop()
        copy = push(copy, op)
        copy.push(lastOp)
        endMutations()
        return copy
    }

    if (
        "insert" in lastOp && "insert" in op
        && typeof lastOp.insert === "string" && typeof op.insert === "string"
        && isEqual(lastOp.attributes, op.attributes)
    ) {
        copy[length - 1] = { insert: lastOp.insert + op.insert, attributes: op.attributes }
        return copy
    }

    if ("retain" in lastOp && "retain" in op && isEqual(lastOp.attributes, op.attributes)) {
        copy[length - 1] = { retain: lastOp.retain + op.retain, attributes: op.attributes }
        return copy
    }

    copy.push(op)
    return copy
}, 2)
