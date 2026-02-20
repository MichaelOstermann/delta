import type { OpIterator } from "."
import { Op } from "../Op"

export function next(
    opIt: OpIterator,
    length: number = Infinity,
): Op {
    const nextOp = opIt.ops[opIt.index]

    if (nextOp) {
        const offset = opIt.offset
        const opLength = Op.length(nextOp)
        if (length >= opLength - offset) {
            length = opLength - offset
            opIt.index += 1
            opIt.offset = 0
        }
        else {
            opIt.offset += length
        }
        if (nextOp.type === "remove") {
            return { attributes: undefined, type: "remove", value: length }
        }
        if (nextOp.type === "retain") {
            return { attributes: nextOp.attributes, type: "retain", value: length }
        }
        if (typeof nextOp.value === "string") {
            return { attributes: nextOp.attributes, type: "insert", value: nextOp.value.slice(offset, offset + length) }
        }
        // Embed inserts are atomic (length 1) — return the whole object
        return { attributes: nextOp.attributes, type: "insert", value: nextOp.value }
    }

    return { attributes: undefined, type: "retain", value: Infinity }
}
