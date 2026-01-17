import type { OpIterator } from "."
import type { Delta } from "../Delta"
import type { OpAttributes } from "../OpAttributes"
import { hasNext } from "./hasNext"
import { next } from "./next"

export function rest<T extends OpAttributes>(opIt: OpIterator<T>): Delta<T> {
    if (!hasNext(opIt)) {
        return []
    }
    if (opIt.offset === 0) {
        return opIt.ops.slice(opIt.index)
    }
    // Clone iterator so next() doesn't mutate the original
    const clone: OpIterator<T> = { ...opIt }
    const nextOp = next(clone)
    return [nextOp, ...opIt.ops.slice(opIt.index + 1)]
}
