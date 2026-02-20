import type { OpIterator } from "."
import type { Delta } from "../Delta"

export function create(ops: Delta): OpIterator {
    return { index: 0, offset: 0, ops }
}
