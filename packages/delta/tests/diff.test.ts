import { describe, expect, it } from "bun:test"
import { Delta } from "../src/Delta"
import { $, pipe } from "./helpers"

describe("diff()", () => {
    it("insert", () => {
        const a = Delta.insert([], "A")
        const b = Delta.insert([], "AB")
        const expected = pipe([], $.retain(1), $.insert("B"))
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("remove", () => {
        const a = Delta.insert([], "AB")
        const b = Delta.insert([], "A")
        const expected = pipe([], $.retain(1), $.remove(1))
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("retain", () => {
        const a = Delta.insert([], "A")
        const b = Delta.insert([], "A")
        const expected: Delta = []
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("format", () => {
        const a = Delta.insert([], "A")
        const b = Delta.insert([], "A", { bold: true })
        const expected = Delta.retain([], 1, { bold: true })
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("same attributes", () => {
        const a = Delta.insert([], "A", { bold: true, color: "red" })
        const b = Delta.insert([], "A", { bold: true, color: "red" })
        const expected: Delta = []
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("error on non-documents", () => {
        const a = Delta.insert([], "A")
        const b = pipe([], $.retain(1), $.insert("B"))
        expect(() => {
            Delta.diff(a, b)
        }).toThrow()
        expect(() => {
            Delta.diff(b, a)
        }).toThrow()
    })

    it("inconvenient indexes", () => {
        const a = pipe(
            [],
            $.insert("12", { bold: true }),
            $.insert("34", { italic: true }),
        )
        const b = Delta.insert([], "123", { color: "red" })
        const expected = pipe(
            [],
            $.retain(2, { bold: null, color: "red" }),
            $.retain(1, { color: "red", italic: null }),
            $.remove(1),
        )
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("combination", () => {
        const a = pipe(
            [],
            $.insert("Bad", { color: "red" }),
            $.insert("cat", { color: "blue" }),
        )
        const b = pipe(
            [],
            $.insert("Good", { bold: true }),
            $.insert("dog", { italic: true }),
        )
        const expected = pipe(
            [],
            $.insert("Good", { bold: true }),
            $.insert("dog", { italic: true }),
            $.remove(6),
        )
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("same document", () => {
        const a = pipe([], $.insert("A"), $.insert("B", { bold: true }))
        const expected: Delta = []
        expect(Delta.diff(a, a)).toEqual(expected)
    })

    it("immutability", () => {
        const attr1 = { color: "red" }
        const attr2 = { color: "red" }
        const a1 = Delta.insert([], "A", attr1)
        const a2 = Delta.insert([], "A", attr1)
        const b1 = pipe([], $.insert("A", { bold: true }), $.insert("B"))
        const b2 = pipe([], $.insert("A", { bold: true }), $.insert("B"))
        const expected = pipe(
            [],
            $.retain(1, { bold: true, color: null }),
            $.insert("B"),
        )
        expect(Delta.diff(a1, b1)).toEqual(expected)
        expect(a1).toEqual(a2)
        expect(b2).toEqual(b2)
        expect(attr1).toEqual(attr2)
    })

    it("embed match", () => {
        const a = Delta.insert([], { embed: 1 })
        const b = Delta.insert([], { embed: 1 })
        const expected: Delta = []
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("embed mismatch", () => {
        const a = Delta.insert([], { embed: 1 })
        const b = Delta.insert([], { embed: 2 })
        const expected = pipe([], $.remove(1), $.insert({ embed: 2 }))
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("embed object match", () => {
        const a = Delta.insert([], { image: "http://quilljs.com" })
        const b = Delta.insert([], { image: "http://quilljs.com" })
        const expected: Delta = []
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("embed object mismatch (different keys)", () => {
        const a = Delta.insert([], { alt: "Overwrite", image: "http://quilljs.com" })
        const b = Delta.insert([], { image: "http://quilljs.com" })
        const expected = pipe([], $.insert({ image: "http://quilljs.com" }), $.remove(1))
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("embed false positive (\\0 string vs embed are different)", () => {
        const a = Delta.insert([], { embed: 1 })
        const b = Delta.insert([], String.fromCharCode(0))
        const expected = pipe([], $.insert(String.fromCharCode(0)), $.remove(1))
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("non-document", () => {
        const a = Delta.insert([], "Test")
        const b = Delta.remove([], 4)
        expect(() => {
            Delta.diff(a, b)
        }).toThrow(new Error("Delta.diff(a, b): b is not a document"))
    })
})
