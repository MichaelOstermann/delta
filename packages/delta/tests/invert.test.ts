import { pipe } from "@monstermann/dfdl"
import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("invert()", () => {
    it("insert", () => {
        const delta = pipe([], Delta.retain(2), Delta.insert("A"))
        const base = Delta.insert([], "123456")
        const expected = pipe([], Delta.retain(2), Delta.remove(1))
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("remove", () => {
        const delta = pipe([], Delta.retain(2), Delta.remove(3))
        const base = Delta.insert([], "123456")
        const expected = pipe([], Delta.retain(2), Delta.insert("345"))
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("retain", () => {
        const delta = pipe([], Delta.retain(2), Delta.retain(3, { bold: true }))
        const base = Delta.insert([], "123456")
        const expected = pipe([], Delta.retain(2), Delta.retain(3, { bold: null }))
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("retain on a delta with different attributes", () => {
        const base = pipe([], Delta.insert("123"), Delta.insert("4", { bold: true }))
        const delta = Delta.retain([], 4, { italic: true })
        const expected = Delta.retain([], 4, { italic: null })
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("combined", () => {
        const delta = pipe(
            [],
            Delta.retain(2),
            Delta.remove(2),
            Delta.insert("AB", { italic: true }),
            Delta.retain(2, { bold: true, italic: null }),
            Delta.retain(2, { color: "red" }),
            Delta.remove(1),
        )
        const base = pipe(
            [],
            Delta.insert("123", { bold: true }),
            Delta.insert("456", { italic: true }),
            Delta.insert("789", { bold: true, color: "red" }),
        )
        const expected = pipe(
            [],
            Delta.retain(2),
            Delta.insert("3", { bold: true }),
            Delta.insert("4", { italic: true }),
            Delta.remove(2),
            Delta.retain(2, { bold: null, italic: true }),
            Delta.retain(2),
            Delta.insert("9", { bold: true, color: "red" }),
        )
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })
})
