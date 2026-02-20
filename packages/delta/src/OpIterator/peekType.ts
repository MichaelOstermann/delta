import type { OpIterator } from "."

export function peekType(opIt: OpIterator): "insert" | "retain" | "remove" {
    const op = opIt.ops[opIt.index]
    return op?.type ?? "retain"
}
