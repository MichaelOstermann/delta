import type { NullableOpAttributes, OpAttributes } from "."

export function compose<T extends OpAttributes>(
    a: NullableOpAttributes<T> | undefined,
    b: NullableOpAttributes<NoInfer<T>> | undefined,
    keepNull: boolean = false,
): NullableOpAttributes<T> | undefined {
    if (!b) return a

    if (!a) {
        return keepNull ? b : stripNulls(b)
    }

    const result: NullableOpAttributes<T> = {}

    for (const key of unionKeys(a, b)) {
        // Key only in `a`
        if (key in a && !(key in b)) {
            result[key] = a[key]
            continue
        }

        // Key in `b` (overrides `a`)
        if (b[key] !== null || keepNull) {
            result[key] = b[key]
        }
    }

    return Object.keys(result).length ? result : undefined
}

function stripNulls<T extends OpAttributes>(
    attrs: NullableOpAttributes<T>,
): NullableOpAttributes<T> | undefined {
    const result: NullableOpAttributes<T> = {}

    for (const key of Object.keys(attrs) as (keyof T)[]) {
        if (attrs[key] !== null) {
            result[key] = attrs[key]
        }
    }

    return Object.keys(result).length ? result : undefined
}

function unionKeys<T extends OpAttributes>(
    a: NullableOpAttributes<T>,
    b: NullableOpAttributes<T>,
): Set<keyof T> {
    return new Set(
        [...Object.keys(a), ...Object.keys(b)] as (keyof T)[],
    )
}
