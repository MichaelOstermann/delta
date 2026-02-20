import type { Delta } from "../Delta"

export interface OpIterator {
    index: number
    offset: number
    ops: Delta
}
