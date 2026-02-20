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
 * Delta.push([], { type: "insert", value: "Hello" });
 * // [{ type: "insert", value: "Hello" }]
 *
 * Delta.push(Delta.push([], { type: "insert", value: "Hello" }), {
 *     type: "insert",
 *     value: " world",
 * });
 * // [{ type: "insert", value: "Hello world" }]
 * ```
 *
 * ```ts [data-last]
 * import { Delta } from "@monstermann/delta";
 *
 * pipe([], Delta.push({ type: "insert", value: "Hello" }));
 * // [{ type: "insert", value: "Hello" }]
 *
 * pipe(
 *     [],
 *     Delta.push({ type: "insert", value: "Hello" }),
 *     Delta.push({ type: "insert", value: " world" }),
 * );
 * // [{ type: "insert", value: "Hello world" }]
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

    if (lastOp.type === "remove" && op.type === "remove") {
        copy[length - 1] = { attributes: undefined, type: "remove", value: lastOp.value + op.value }
        return copy
    }

    // Since it does not matter if we insert before or after deleting at the same index,
    // always prefer to insert first.
    if (lastOp.type === "remove" && op.type === "insert") {
        startMutations()
        copy.pop()
        copy = push(copy, op)
        copy.push(lastOp)
        endMutations()
        return copy
    }

    if (
        lastOp.type === "insert" && op.type === "insert"
        && typeof lastOp.value === "string" && typeof op.value === "string"
        && isEqual(lastOp.attributes, op.attributes)
    ) {
        copy[length - 1] = { attributes: op.attributes, type: "insert", value: lastOp.value + op.value }
        return copy
    }

    if (lastOp.type === "retain" && op.type === "retain" && isEqual(lastOp.attributes, op.attributes)) {
        copy[length - 1] = { attributes: op.attributes, type: "retain", value: lastOp.value + op.value }
        return copy
    }

    copy.push(op)
    return copy
}, 2)
