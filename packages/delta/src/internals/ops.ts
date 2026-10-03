import type { Op } from "../Op"
import type { OpAttributes } from "../OpAttributes"
import { hasKeys } from "./hasKeys"
import { isEqual } from "./isEqual"

// The mutable counterparts of `Delta.push`, `Delta.insert`, `Delta.retain`, `Delta.remove` and `Delta.chop`,
// for building up a delta that nothing else has seen yet.

export function pushOp(ops: Op[], op: Op): void {
    const length = ops.length
    if (!length) return void ops.push(op)

    const lastOp = ops[length - 1]!

    if ("delete" in lastOp && "delete" in op) {
        ops[length - 1] = { delete: lastOp.delete + op.delete }
        return
    }

    // Since it does not matter if we insert before or after deleting at the same index,
    // always prefer to insert first.
    if ("delete" in lastOp && "insert" in op) {
        ops.pop()
        pushOp(ops, op)
        ops.push(lastOp)
        return
    }

    if (
        "insert" in lastOp && "insert" in op
        && typeof lastOp.insert === "string" && typeof op.insert === "string"
        && isEqual(lastOp.attributes, op.attributes)
    ) {
        ops[length - 1] = { attributes: op.attributes, insert: lastOp.insert + op.insert }
        return
    }

    if ("retain" in lastOp && "retain" in op && isEqual(lastOp.attributes, op.attributes)) {
        ops[length - 1] = { attributes: op.attributes, retain: lastOp.retain + op.retain }
        return
    }

    ops.push(op)
}

export function retainOp(ops: Op[], length: number, attributes?: OpAttributes | null): void {
    if (!Number.isInteger(length)) return
    if (length <= 0) return
    pushOp(ops, {
        attributes: attributes && hasKeys(attributes) ? attributes : undefined,
        retain: length,
    })
}

export function removeOp(ops: Op[], length: number): void {
    if (!Number.isInteger(length)) return
    if (length <= 0) return
    pushOp(ops, { delete: length })
}

export function chopOps(ops: Op[]): void {
    const lastOp = ops[ops.length - 1]
    if (lastOp != null && "retain" in lastOp && !lastOp.attributes) ops.pop()
}
