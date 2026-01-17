import type { NullableOpAttributes, OpAttributes } from "../OpAttributes"

export type InsertOp<T extends OpAttributes> = {
    attributes: NullableOpAttributes<T> | undefined
    type: "insert"
    value: string
}

export type RetainOp<T extends OpAttributes> = {
    attributes: NullableOpAttributes<T> | undefined
    type: "retain"
    value: number
}

export type RemoveOp = {
    attributes: undefined
    type: "remove"
    value: number
}

export type Op<T extends OpAttributes = OpAttributes> =
    | InsertOp<T>
    | RetainOp<T>
    | RemoveOp
