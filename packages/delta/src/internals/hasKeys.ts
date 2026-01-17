export function hasKeys(value: Record<PropertyKey, any>): boolean {
    for (const key in value) {
        if (Object.hasOwn(value, key)) return true
    }
    return false
}
