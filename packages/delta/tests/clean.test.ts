import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("clean()", () => {
    it("merges consecutive inserts with same attributes", () => {
        const delta = [
            { insert: "Hello" as const, attributes: undefined },
            { insert: " world" as const, attributes: undefined },
        ]
        expect(Delta.clean(delta)).toEqual([
            { insert: "Hello world", attributes: undefined },
        ])
    })

    it("merges consecutive inserts with matching attributes", () => {
        const delta = [
            { insert: "Hello" as const, attributes: { bold: true } },
            { insert: " world" as const, attributes: { bold: true } },
        ]
        expect(Delta.clean(delta)).toEqual([
            { insert: "Hello world", attributes: { bold: true } },
        ])
    })

    it("does not merge inserts with different attributes", () => {
        const delta: Delta = [
            { insert: "Hello", attributes: { bold: true } },
            { insert: " world", attributes: { italic: true } },
        ]
        expect(Delta.clean(delta)).toEqual(delta)
    })

    it("merges consecutive removes", () => {
        const delta = [
            { delete: 3 as const },
            { delete: 5 as const },
        ]
        expect(Delta.clean(delta)).toEqual([
            { delete: 8 },
        ])
    })

    it("merges consecutive retains with same attributes", () => {
        const delta = [
            { retain: 3 as const, attributes: { bold: true } },
            { retain: 5 as const, attributes: { bold: true } },
        ]
        expect(Delta.clean(delta)).toEqual([
            { retain: 8, attributes: { bold: true } },
        ])
    })

    it("returns same array if already clean", () => {
        const delta = Delta.insert([], "Hello")
        expect(Delta.clean(delta)).toBe(delta)
    })

    it("returns empty array for empty input", () => {
        expect(Delta.clean([])).toEqual([])
    })
})
