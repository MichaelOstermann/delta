import { describe, expect, it } from "bun:test"
import { Delta } from "../src/Delta"
import { $, pipe } from "./helpers"

describe("invert()", () => {
    it("insert", () => {
        const delta = pipe([], $.retain(2), $.insert("A"))
        const base = Delta.insert([], "123456")
        const expected = pipe([], $.retain(2), $.remove(1))
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("remove", () => {
        const delta = pipe([], $.retain(2), $.remove(3))
        const base = Delta.insert([], "123456")
        const expected = pipe([], $.retain(2), $.insert("345"))
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("retain", () => {
        const delta = pipe([], $.retain(2), $.retain(3, { bold: true }))
        const base = Delta.insert([], "123456")
        const expected = pipe([], $.retain(2), $.retain(3, { bold: null }))
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("retain on a delta with different attributes", () => {
        const base = pipe([], $.insert("123"), $.insert("4", { bold: true }))
        const delta = Delta.retain([], 4, { italic: true })
        const expected = Delta.retain([], 4, { italic: null })
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("insert embed inverts to remove(1)", () => {
        const delta = pipe([], $.retain(2), $.insert({ embed: 1 }))
        const base = Delta.insert([], "12")
        const expected = pipe([], $.retain(2), $.remove(1))
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("retain(1, attrs) over embed base inverts attrs", () => {
        const base = Delta.insert([], { embed: 1 }, { bold: true })
        const delta = Delta.retain([], 1, { italic: true })
        const expected = Delta.retain([], 1, { italic: null })
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("combined", () => {
        const delta = pipe(
            [],
            $.retain(2),
            $.remove(2),
            $.insert("AB", { italic: true }),
            $.retain(2, { bold: true, italic: null }),
            $.retain(2, { color: "red" }),
            $.remove(1),
        )
        const base = pipe(
            [],
            $.insert("123", { bold: true }),
            $.insert("456", { italic: true }),
            $.insert("789", { bold: true, color: "red" }),
        )
        const expected = pipe(
            [],
            $.retain(2),
            $.insert("3", { bold: true }),
            $.insert("4", { italic: true }),
            $.remove(2),
            $.retain(2, { bold: null, italic: true }),
            $.retain(2),
            $.insert("9", { bold: true, color: "red" }),
        )
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })
})
