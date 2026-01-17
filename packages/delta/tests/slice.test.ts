import { pipe } from "@monstermann/dfdl"
import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("slice()", () => {
    it("slices from start", () => {
        const delta = Delta.insert([], "Hello world")
        expect(Delta.slice(delta, 0, 5)).toEqual([
            { attributes: undefined, type: "insert", value: "Hello" },
        ])
    })

    it("slices from middle", () => {
        const delta = Delta.insert([], "Hello world")
        expect(Delta.slice(delta, 6)).toEqual([
            { attributes: undefined, type: "insert", value: "world" },
        ])
    })

    it("slices with start and end", () => {
        const delta = Delta.insert([], "Hello world")
        expect(Delta.slice(delta, 2, 8)).toEqual([
            { attributes: undefined, type: "insert", value: "llo wo" },
        ])
    })

    it("slices across operations with attributes", () => {
        const delta = pipe(
            [],
            Delta.insert("Hello", { bold: true }),
            Delta.insert(" world", { italic: true }),
        )
        expect(Delta.slice(delta, 3, 8)).toEqual([
            { attributes: { bold: true }, type: "insert", value: "lo" },
            { attributes: { italic: true }, type: "insert", value: " wo" },
        ])
    })

    it("returns empty for zero-length slice", () => {
        const delta = Delta.insert([], "Hello")
        expect(Delta.slice(delta, 2, 2)).toEqual([])
    })

    it("returns empty for empty delta", () => {
        expect(Delta.slice([], 0, 5)).toEqual([])
    })

    it("handles start beyond length", () => {
        const delta = Delta.insert([], "Hello")
        expect(Delta.slice(delta, 10)).toEqual([])
    })
})
