import type { OpAttributes } from "../OpAttributes"

export type EmbedValue = Record<string, unknown>

export type InsertOp = {
    insert: string | EmbedValue
    attributes: OpAttributes | undefined
}

export type RetainOp = {
    retain: number
    attributes: OpAttributes | undefined
}

export type DeleteOp = {
    delete: number
    attributes?: undefined
}

export type Op = InsertOp | RetainOp | DeleteOp
