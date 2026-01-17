import { pipe } from "@monstermann/dfdl"
import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("diff()", () => {
    it("insert", () => {
        const a = Delta.insert([], "A")
        const b = Delta.insert([], "AB")
        const expected = pipe([], Delta.retain(1), Delta.insert("B"))
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("remove", () => {
        const a = Delta.insert([], "AB")
        const b = Delta.insert([], "A")
        const expected = pipe([], Delta.retain(1), Delta.remove(1))
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("retain", () => {
        const a = Delta.insert([], "A")
        const b = Delta.insert([], "A")
        const expected: Delta<any>[] = []
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
        const expected: Delta<any>[] = []
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("error on non-documents", () => {
        const a = Delta.insert([], "A")
        const b = pipe([], Delta.retain(1), Delta.insert("B"))
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
            Delta.insert("12", { bold: true }),
            Delta.insert("34", { italic: true }),
        )
        const b = Delta.insert([], "123", { color: "red" })
        const expected = pipe(
            [],
            Delta.retain(2, { bold: null, color: "red" }),
            Delta.retain(1, { color: "red", italic: null }),
            Delta.remove(1),
        )
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("combination", () => {
        const a = pipe(
            [],
            Delta.insert("Bad", { color: "red" }),
            Delta.insert("cat", { color: "blue" }),
        )
        const b = pipe(
            [],
            Delta.insert("Good", { bold: true }),
            Delta.insert("dog", { italic: true }),
        )
        const expected = pipe(
            [],
            Delta.insert("Good", { bold: true }),
            Delta.insert("dog", { italic: true }),
            Delta.remove(6),
        )
        expect(Delta.diff(a, b)).toEqual(expected)
    })

    it("same document", () => {
        const a = pipe([], Delta.insert("A"), Delta.insert("B", { bold: true }))
        const expected: Delta<any>[] = []
        expect(Delta.diff(a, a)).toEqual(expected)
    })

    it("immutability", () => {
        const attr1 = { color: "red" }
        const attr2 = { color: "red" }
        const a1 = Delta.insert([], "A", attr1)
        const a2 = Delta.insert([], "A", attr1)
        const b1 = pipe([], Delta.insert("A", { bold: true }), Delta.insert("B"))
        const b2 = pipe([], Delta.insert("A", { bold: true }), Delta.insert("B"))
        const expected = pipe(
            [],
            Delta.retain(1, { bold: true, color: null }),
            Delta.insert("B"),
        )
        expect(Delta.diff(a1, b1)).toEqual(expected)
        expect(a1).toEqual(a2)
        expect(b2).toEqual(b2)
        expect(attr1).toEqual(attr2)
    })

    it("non-document", () => {
        const a = Delta.insert([], "Test")
        const b = Delta.remove([], 4)
        expect(() => {
            Delta.diff(a, b)
        }).toThrow(new Error("Delta.diff(a, b): b is not a document"))
    })
})
