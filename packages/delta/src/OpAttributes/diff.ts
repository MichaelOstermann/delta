import type { NullableOpAttributes, OpAttributes } from "."

export function diff<T extends OpAttributes>(
    a: NullableOpAttributes<T> | undefined,
    b: NullableOpAttributes<NoInfer<T>> | undefined = {},
): NullableOpAttributes<T> | undefined {
    if (!a) return b

    const result: NullableOpAttributes<T> = {}

    const keys: Set<keyof T> = new Set([
        ...Object.keys(a),
        ...Object.keys(b),
    ])

    for (const key of keys) {
        if (a[key] === b[key]) continue
        result[key] = key in b ? b[key] : null
    }

    return Object.keys(result).length ? result : undefined
}
