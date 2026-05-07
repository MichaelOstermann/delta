import type { OpAttributes } from "../OpAttributes"

export type EmbedValue = Record<string, unknown>

export type InsertOp = {
    attributes?: OpAttributes
    insert: string | EmbedValue
}

export type RetainOp = {
    attributes?: OpAttributes
    retain: number
}

export type DeleteOp = {
    attributes?: undefined
    delete: number
}

export type Op = InsertOp | RetainOp | DeleteOp
