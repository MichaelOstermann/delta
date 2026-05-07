import { pipe } from "@monstermann/dfdl"
import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("concat()", () => {
    it("concatenates two inserts", () => {
        const a = Delta.insert([], "Hello")
        const b = Delta.insert([], " world")
        expect(Delta.concat(a, b)).toEqual([
            { attributes: undefined, insert: "Hello world" },
        ])
    })

    it("concatenates inserts with different attributes", () => {
        const a = Delta.insert([], "Hello", { bold: true })
        const b = Delta.insert([], " world", { italic: true })
        expect(Delta.concat(a, b)).toEqual([
            { attributes: { bold: true }, insert: "Hello" },
            { attributes: { italic: true }, insert: " world" },
        ])
    })

    it("returns a when b is empty", () => {
        const a = Delta.insert([], "Hello")
        expect(Delta.concat(a, [])).toBe(a)
    })

    it("returns b when a is empty", () => {
        const b = Delta.insert([], "Hello")
        expect(Delta.concat([], b)).toBe(b)
    })

    it("concatenates with removes", () => {
        const a = Delta.insert([], "Hello")
        const b = Delta.remove([], 3)
        expect(Delta.concat(a, b)).toEqual([
            { attributes: undefined, insert: "Hello" },
            { delete: 3 },
        ])
    })

    it("concatenates with retains", () => {
        const a = Delta.insert([], "Hello")
        const b = Delta.retain([], 5, { bold: true })
        expect(Delta.concat(a, b)).toEqual([
            { attributes: undefined, insert: "Hello" },
            { attributes: { bold: true }, retain: 5 },
        ])
    })

    it("works with pipe syntax", () => {
        const a = Delta.insert([], "Hello")
        const b = Delta.insert([], " world")
        expect(pipe(a, Delta.concat(b))).toEqual([
            { attributes: undefined, insert: "Hello world" },
        ])
    })
})
