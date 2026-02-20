import type { OpIterator } from "."
import type { Delta } from "../Delta"
import { hasNext } from "./hasNext"
import { next } from "./next"

export function rest(opIt: OpIterator): Delta {
    if (!hasNext(opIt)) {
        return []
    }
    if (opIt.offset === 0) {
        return opIt.ops.slice(opIt.index)
    }
    // Clone iterator so next() doesn't mutate the original
    const clone: OpIterator = { ...opIt }
    const nextOp = next(clone)
    return [nextOp, ...opIt.ops.slice(opIt.index + 1)]
}
