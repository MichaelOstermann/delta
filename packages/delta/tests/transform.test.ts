import { describe, expect, it } from "bun:test"
import { Delta } from "../src/Delta"
import { $, pipe } from "./helpers"

describe("transform()", () => {
    it("insert + insert", () => {
        const a = Delta.insert([], "A")
        const b = Delta.insert([], "B")
        const expected1 = pipe([], $.retain(1), $.insert("B"))
        const expected2 = Delta.insert([], "B")
        expect(Delta.transform(a, b, true)).toEqual(expected1)
        expect(Delta.transform(a, b, false)).toEqual(expected2)
    })

    it("insert + retain", () => {
        const a = Delta.insert([], "A")
        const b = Delta.retain([], 1, { bold: true, color: "red" })
        const expected = pipe(
            [],
            $.retain(1),
            $.retain(1, { bold: true, color: "red" }),
        )
        expect(Delta.transform(a, b, true)).toEqual(expected)
    })

    it("insert + remove", () => {
        const a = Delta.insert([], "A")
        const b = Delta.remove([], 1)
        const expected = pipe([], $.retain(1), $.remove(1))
        expect(Delta.transform(a, b, true)).toEqual(expected)
    })

    it("remove + insert", () => {
        const a = Delta.remove([], 1)
        const b = Delta.insert([], "B")
        const expected = Delta.insert([], "B")
        expect(Delta.transform(a, b, true)).toEqual(expected)
    })

    it("remove + retain", () => {
        const a = Delta.remove([], 1)
        const b = Delta.retain([], 1, { bold: true, color: "red" })
        const expected: Delta = []
        expect(Delta.transform(a, b, true)).toEqual(expected)
    })

    it("remove + remove", () => {
        const a = Delta.remove([], 1)
        const b = Delta.remove([], 1)
        const expected: Delta = []
        expect(Delta.transform(a, b, true)).toEqual(expected)
    })

    it("retain + insert", () => {
        const a = Delta.retain([], 1, { color: "blue" })
        const b = Delta.insert([], "B")
        const expected = Delta.insert([], "B")
        expect(Delta.transform(a, b, true)).toEqual(expected)
    })

    it("retain + retain", () => {
        const a = Delta.retain([], 1, { color: "blue" })
        const b = Delta.retain([], 1, { bold: true, color: "red" })
        const expected1 = Delta.retain([], 1, { bold: true })
        const expected2: Delta = []
        expect(Delta.transform(a, b, true)).toEqual(expected1)
        expect(Delta.transform(b, a, true)).toEqual(expected2)
    })

    it("retain + retain without priority", () => {
        const a = Delta.retain([], 1, { color: "blue" })
        const b = Delta.retain([], 1, { bold: true, color: "red" })
        const expected1 = Delta.retain([], 1, { bold: true, color: "red" })
        const expected2 = Delta.retain([], 1, { color: "blue" })
        expect(Delta.transform(a, b, false)).toEqual(expected1)
        expect(Delta.transform(b, a, false)).toEqual(expected2)
    })

    it("retain + remove", () => {
        const a = Delta.retain([], 1, { color: "blue" })
        const b = Delta.remove([], 1)
        const expected = Delta.remove([], 1)
        expect(Delta.transform(a, b, true)).toEqual(expected)
    })

    it("alternating edits", () => {
        const a = pipe([], $.retain(2), $.insert("si"), $.remove(5))
        const b = pipe(
            [],
            $.retain(1),
            $.insert("e"),
            $.remove(5),
            $.retain(1),
            $.insert("ow"),
        )
        const expected1 = pipe(
            [],
            $.retain(1),
            $.insert("e"),
            $.remove(1),
            $.retain(2),
            $.insert("ow"),
        )
        const expected2 = pipe([], $.retain(2), $.insert("si"), $.remove(1))
        expect(Delta.transform(a, b, false)).toEqual(expected1)
        expect(Delta.transform(b, a, false)).toEqual(expected2)
    })

    it("conflicting appends", () => {
        const a = pipe([], $.retain(3), $.insert("aa"))
        const b = pipe([], $.retain(3), $.insert("bb"))
        const expected1 = pipe([], $.retain(5), $.insert("bb"))
        const expected2 = pipe([], $.retain(3), $.insert("aa"))
        expect(Delta.transform(a, b, true)).toEqual(expected1)
        expect(Delta.transform(b, a, false)).toEqual(expected2)
    })

    it("prepend + append", () => {
        const a = Delta.insert([], "aa")
        const b = pipe([], $.retain(3), $.insert("bb"))
        const expected1 = pipe([], $.retain(5), $.insert("bb"))
        const expected2 = Delta.insert([], "aa")
        expect(Delta.transform(a, b, false)).toEqual(expected1)
        expect(Delta.transform(b, a, false)).toEqual(expected2)
    })

    it("trailing removes with differing lengths", () => {
        const a = pipe([], $.retain(2), $.remove(1))
        const b = Delta.remove([], 3)
        const expected1 = Delta.remove([], 2)
        const expected2: Delta = []
        expect(Delta.transform(a, b, false)).toEqual(expected1)
        expect(Delta.transform(b, a, false)).toEqual(expected2)
    })

    it("insert embed + insert (priority) shifts insert by 1", () => {
        const a = Delta.insert([], { embed: 1 })
        const b = Delta.insert([], "B")
        const expected1 = pipe([], $.retain(1), $.insert("B"))
        const expected2 = Delta.insert([], "B")
        expect(Delta.transform(a, b, true)).toEqual(expected1)
        expect(Delta.transform(a, b, false)).toEqual(expected2)
    })

    it("insert embed + retain shifts retain by 1", () => {
        const a = Delta.insert([], { embed: 1 })
        const b = Delta.retain([], 1, { bold: true, color: "red" })
        const expected = pipe(
            [],
            $.retain(1),
            $.retain(1, { bold: true, color: "red" }),
        )
        expect(Delta.transform(a, b, true)).toEqual(expected)
    })

    it("immutability", () => {
        const a1 = Delta.insert([], "A")
        const a2 = Delta.insert([], "A")
        const b1 = Delta.insert([], "B")
        const b2 = Delta.insert([], "B")
        const expected = pipe([], $.retain(1), $.insert("B"))
        expect(Delta.transform(a1, b1, true)).toEqual(expected)
        expect(a1).toEqual(a2)
        expect(b1).toEqual(b2)
    })
})
