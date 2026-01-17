import type { NullableOpAttributes, OpAttributes } from "."

export function invert<T extends OpAttributes>(
    a: NullableOpAttributes<T> | undefined,
    b: NullableOpAttributes<NoInfer<T>> | undefined,
): NullableOpAttributes<T> {
    if (!a) a = {}
    if (!b) b = {}

    const result: NullableOpAttributes<T> = {}

    const keys: Set<keyof T> = new Set([
        ...Object.keys(a),
        ...Object.keys(b),
    ])

    for (const key of keys) {
        if (a[key] === b[key]) continue

        if (key in b && key in a) {
            result[key] = b[key]
        }
        else if (!(key in b)) {
            result[key] = null
        }
    }

    return result
}
