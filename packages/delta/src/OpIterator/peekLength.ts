import type { OpIterator } from "."
import type { OpAttributes } from "../OpAttributes"

export function peekLength<T extends OpAttributes>(opIt: OpIterator<T>): number {
    const op = opIt.ops[opIt.index]
    if (!op) return Infinity
    const length = op.type === "insert" ? op.value.length : op.value
    return length - opIt.offset
}
