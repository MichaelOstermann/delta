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

    it("plain retains between edits", () => {
        const delta = pipe([], $.remove(1), $.retain(3), $.retain(2, { bold: true }), $.retain(2), $.remove(1))
        const base = pipe([], $.insert("12", { italic: true }), $.insert("3456789"))
        const expected = pipe(
            [],
            $.insert("1", { italic: true }),
            $.retain(3),
            $.retain(2, { bold: null }),
            $.retain(2),
            $.insert("9"),
        )
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("consumes one base operation in several steps", () => {
        const delta = pipe([], $.remove(1), $.retain(1, { bold: true }), $.remove(2), $.retain(1, { bold: null }))
        const base = Delta.insert([], "123456", { bold: true })
        const expected = pipe(
            [],
            $.insert("1", { bold: true }),
            $.retain(1),
            $.insert("34", { bold: true }),
            $.retain(1, { bold: true }),
        )
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("remove embed", () => {
        const delta = pipe([], $.retain(1), $.remove(2))
        const base = pipe([], $.insert("1"), $.insert({ image: "a.png" }, { alt: "A" }), $.insert("2"))
        const expected = pipe([], $.retain(1), $.insert({ image: "a.png" }, { alt: "A" }), $.insert("2"))
        const inverted = Delta.invert(delta, base)
        expect(expected).toEqual(inverted)
        expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
    })

    it("stops at the end of the base", () => {
        const base = Delta.insert([], "123")
        expect(Delta.invert(pipe([], $.retain(2), $.remove(5)), base))
            .toEqual(pipe([], $.retain(2), $.insert("3")))
        expect(Delta.invert(Delta.retain([], 5, { bold: true }), base))
            .toEqual(Delta.retain([], 3, { bold: null }))
        expect(Delta.invert(pipe([], $.retain(5), $.remove(2)), base))
            .toEqual([])
    })

    it("undoes generated changes", () => {
        // Deterministic PRNG, so that failures are reproducible.
        let seed = 1
        const random = (max: number) => {
            seed = (seed * 1103515245 + 12345) % 2147483648
            return seed % max
        }
        const attributes = [undefined, { bold: true }, { italic: true }, { bold: true, color: "red" }]
        const formats = [{ bold: true }, { bold: null }, { color: "blue" }, { color: "red", italic: null }]

        for (let run = 0; run < 500; run++) {
            let base: Delta = []
            for (let i = random(6); i >= 0; i--) {
                const content = random(4) ? "abcdef".slice(0, 1 + random(6)) : { image: `${i}.png` }
                base = Delta.insert(base, content, attributes[random(attributes.length)])
            }

            let delta: Delta = []
            let remaining = Delta.length(base)
            while (remaining > 0) {
                const length = 1 + random(Math.min(remaining, 4))
                const type = random(5)
                if (type === 0) delta = Delta.insert(delta, "XY", attributes[random(attributes.length)])
                else if (type === 1) delta = Delta.remove(delta, length)
                else if (type === 2) delta = Delta.retain(delta, length)
                else delta = Delta.retain(delta, length, formats[random(formats.length)])
                if (type !== 0) remaining -= length
            }

            const inverted = Delta.invert(delta, base)
            expect(Delta.compose(Delta.compose(base, delta), inverted)).toEqual(base)
        }
    })
})
