import type { OpAttributes } from "../OpAttributes"

export type EmbedValue = Record<string, unknown>

export type InsertOp = {
    attributes: OpAttributes | undefined
    type: "insert"
    value: string | EmbedValue
}

export type RetainOp = {
    attributes: OpAttributes | undefined
    type: "retain"
    value: number
}

export type RemoveOp = {
    attributes: undefined
    type: "remove"
    value: number
}

export type Op = InsertOp | RetainOp | RemoveOp
