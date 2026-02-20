import type { OpIterator } from "."
import { peekLength } from "./peekLength"

export function hasNext(opIt: OpIterator): boolean {
    return peekLength(opIt) < Infinity
}
