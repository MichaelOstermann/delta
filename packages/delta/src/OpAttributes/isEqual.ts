import type { OpAttributes } from "."

export function isEqual<T extends OpAttributes>(
    a: T | undefined,
    b: NoInfer<T> | undefined,
): boolean {
    if (a === b) return true
    if (!a || !b) return false

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
        if (!Object.hasOwn(b, key)) return false
        if (!Object.is(a[key], b[key])) return false
    }

    return true
}
