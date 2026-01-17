import type { OpIterator } from "."
import type { Op } from "../Op"
import type { OpAttributes } from "../OpAttributes"

export function next<T extends OpAttributes>(
    opIt: OpIterator<T>,
    length: number = Infinity,
): Op<T> {
    const nextOp = opIt.ops[opIt.index]

    if (nextOp) {
        const offset = opIt.offset
        const opLength = nextOp.type === "insert" ? nextOp.value.length : nextOp.value
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
        return { attributes: nextOp.attributes, type: "insert", value: nextOp.value.slice(offset, offset + length) }
    }

    return { attributes: undefined, type: "retain", value: Infinity }
}
