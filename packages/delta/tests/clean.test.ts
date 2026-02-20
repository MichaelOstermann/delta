import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("clean()", () => {
    it("merges consecutive inserts with same attributes", () => {
        const delta = [
            { attributes: undefined, type: "insert" as const, value: "Hello" },
            { attributes: undefined, type: "insert" as const, value: " world" },
        ]
        expect(Delta.clean(delta)).toEqual([
            { attributes: undefined, type: "insert", value: "Hello world" },
        ])
    })

    it("merges consecutive inserts with matching attributes", () => {
        const delta = [
            { attributes: { bold: true }, type: "insert" as const, value: "Hello" },
            { attributes: { bold: true }, type: "insert" as const, value: " world" },
        ]
        expect(Delta.clean(delta)).toEqual([
            { attributes: { bold: true }, type: "insert", value: "Hello world" },
        ])
    })

    it("does not merge inserts with different attributes", () => {
        const delta: Delta = [
            { attributes: { bold: true }, type: "insert", value: "Hello" },
            { attributes: { italic: true }, type: "insert", value: " world" },
        ]
        expect(Delta.clean(delta)).toEqual(delta)
    })

    it("merges consecutive removes", () => {
        const delta = [
            { attributes: undefined, type: "remove" as const, value: 3 },
            { attributes: undefined, type: "remove" as const, value: 5 },
        ]
        expect(Delta.clean(delta)).toEqual([
            { attributes: undefined, type: "remove", value: 8 },
        ])
    })

    it("merges consecutive retains with same attributes", () => {
        const delta = [
            { attributes: { bold: true }, type: "retain" as const, value: 3 },
            { attributes: { bold: true }, type: "retain" as const, value: 5 },
        ]
        expect(Delta.clean(delta)).toEqual([
            { attributes: { bold: true }, type: "retain", value: 8 },
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
