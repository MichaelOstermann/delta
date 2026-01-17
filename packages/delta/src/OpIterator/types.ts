import type { Delta } from "../Delta"
import type { OpAttributes } from "../OpAttributes"

export interface OpIterator<T extends OpAttributes> {
    index: number
    offset: number
    ops: Delta<T>
}
