import type { OpIterator } from "."
import type { Delta } from "../Delta"
import type { OpAttributes } from "../OpAttributes"

export function create<T extends OpAttributes>(ops: Delta<T>): OpIterator<T> {
    return { index: 0, offset: 0, ops }
}
