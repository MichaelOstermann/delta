import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("equals()", () => {
    it("returns true for identical deltas", () => {
        const a = Delta.insert([], "Hello", { bold: true })
        const b = Delta.insert([], "Hello", { bold: true })
        expect(Delta.equals(a, b)).toBe(true)
    })

    it("returns true for empty deltas", () => {
        expect(Delta.equals([], [])).toBe(true)
    })

    it("returns false for different lengths", () => {
        const a = Delta.insert([], "Hello")
        const b = Delta.insert(Delta.insert([], "Hello"), " world")
        expect(Delta.equals(a, b)).toBe(false)
    })

    it("returns false for different values", () => {
        const a = Delta.insert([], "Hello")
        const b = Delta.insert([], "World")
        expect(Delta.equals(a, b)).toBe(false)
    })

    it("returns false for different types", () => {
        const a = Delta.insert([], "Hello")
        const b = Delta.retain([], 5)
        expect(Delta.equals(a, b)).toBe(false)
    })

    it("returns false for different attributes", () => {
        const a = Delta.insert([], "Hello", { bold: true })
        const b = Delta.insert([], "Hello", { italic: true })
        expect(Delta.equals(a, b)).toBe(false)
    })

    it("returns false when one has attributes and other does not", () => {
        const a = Delta.insert([], "Hello", { bold: true })
        const b = Delta.insert([], "Hello")
        expect(Delta.equals(a, b)).toBe(false)
    })

    it("compares multiple operations", () => {
        const a = [
            { insert: "Hello" as const, attributes: { bold: true } },
            { retain: 5 as const, attributes: undefined },
        ]
        const b = [
            { insert: "Hello" as const, attributes: { bold: true } },
            { retain: 5 as const, attributes: undefined },
        ]
        expect(Delta.equals(a, b)).toBe(true)
    })
})
