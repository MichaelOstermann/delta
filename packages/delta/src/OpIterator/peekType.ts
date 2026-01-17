import type { OpIterator } from "."
import type { OpAttributes } from "../OpAttributes"

export function peekType<T extends OpAttributes>(opIt: OpIterator<T>): "insert" | "retain" | "remove" {
    const op = opIt.ops[opIt.index]
    return op?.type ?? "retain"
}
