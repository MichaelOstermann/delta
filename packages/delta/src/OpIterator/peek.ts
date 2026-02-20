import type { OpIterator } from "."
import type { Op } from "../Op"

export function peek(opIt: OpIterator): Op | undefined {
    return opIt.ops[opIt.index]
}
