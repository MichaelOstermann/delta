export type OpAttributes = Record<string, unknown>
export type NullableOpAttributes<T> = { [K in keyof T]?: T[K] | null }
