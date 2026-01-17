import type { NullableOpAttributes, OpAttributes } from "."

export function transform<T extends OpAttributes>(
    a: NullableOpAttributes<T> | undefined,
    b: NullableOpAttributes<NoInfer<T>> | undefined,
    priority: boolean = false,
): NullableOpAttributes<T> | undefined {
    if (!a || !b || !priority) return b

    const result: NullableOpAttributes<T> = {}

    for (const key of Object.keys(b) as (keyof T)[]) {
        if (key in a) continue
        result[key] = b[key]
    }

    return Object.keys(result).length ? result : undefined
}
