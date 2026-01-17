import type { OpIterator } from "."
import type { OpAttributes } from "../OpAttributes"
import { peekLength } from "./peekLength"

export function hasNext<T extends OpAttributes>(opIt: OpIterator<T>): boolean {
    return peekLength(opIt) < Infinity
}
