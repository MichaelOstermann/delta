import type { OpIterator } from "."
import { Op } from "../Op"

export function peekLength(opIt: OpIterator): number {
    const op = opIt.ops[opIt.index]
    if (!op) return Infinity
    return Op.length(op) - opIt.offset
}
