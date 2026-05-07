import type { OpIterator } from "."

export function peekType(opIt: OpIterator): "insert" | "retain" | "delete" {
    const op = opIt.ops[opIt.index]
    if (op == null) return "retain"
    if ("insert" in op) return "insert"
    if ("delete" in op) return "delete"
    return "retain"
}
