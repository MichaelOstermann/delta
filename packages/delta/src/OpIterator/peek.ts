import type { OpIterator } from "."
import type { Op } from "../Op"
import type { OpAttributes } from "../OpAttributes"

export function peek<T extends OpAttributes>(opIt: OpIterator<T>): Op<T> | undefined {
    return opIt.ops[opIt.index]
}
