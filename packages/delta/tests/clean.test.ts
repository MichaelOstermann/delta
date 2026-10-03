import { describe, expect, it } from "bun:test"
import { Delta } from "../src/Delta"

describe("clean()", () => {
    it("merges consecutive inserts with same attributes", () => {
        const delta = [
            { attributes: undefined, insert: "Hello" as const },
            { attributes: undefined, insert: " world" as const },
        ]
        expect(Delta.clean(delta)).toEqual([
            { attributes: undefined, insert: "Hello world" },
        ])
    })

    it("merges consecutive inserts with matching attributes", () => {
        const delta = [
            { attributes: { bold: true }, insert: "Hello" as const },
            { attributes: { bold: true }, insert: " world" as const },
        ]
        expect(Delta.clean(delta)).toEqual([
            { attributes: { bold: true }, insert: "Hello world" },
        ])
    })

    it("does not merge inserts with different attributes", () => {
        const delta: Delta = [
            { attributes: { bold: true }, insert: "Hello" },
            { attributes: { italic: true }, insert: " world" },
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
            { attributes: { bold: true }, retain: 3 as const },
            { attributes: { bold: true }, retain: 5 as const },
        ]
        expect(Delta.clean(delta)).toEqual([
            { attributes: { bold: true }, retain: 8 },
        ])
    })

    it("moves inserts before removes", () => {
        const delta: Delta = [
            { delete: 1 },
            { insert: "a" },
        ]
        expect(Delta.clean(delta)).toEqual([
            { insert: "a" },
            { delete: 1 },
        ])
    })

    it("matches building the same operations one by one", () => {
        const delta: Delta = [
            { retain: 1 },
            { delete: 1 },
            { insert: "a" },
            { delete: 2 },
            { attributes: { bold: true }, insert: "b" },
            { retain: 2 },
        ]
        expect(Delta.clean(delta)).toEqual(delta.reduce(Delta.push, [] as Delta))
    })

    it("returns same array if already clean", () => {
        const delta = Delta.insert([], "Hello")
        expect(Delta.clean(delta)).toBe(delta)
    })

    it("returns empty array for empty input", () => {
        expect(Delta.clean([])).toEqual([])
    })
})
