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
        if ("delete" in nextOp) {
            return { delete: length }
        }
        if ("retain" in nextOp) {
            return { retain: length, attributes: nextOp.attributes }
        }
        if (typeof nextOp.insert === "string") {
            return { insert: nextOp.insert.slice(offset, offset + length), attributes: nextOp.attributes }
        }
        // Embed inserts are atomic (length 1) — return the whole object
        return { insert: nextOp.insert, attributes: nextOp.attributes }
    }

    return { retain: Infinity, attributes: undefined }
}
