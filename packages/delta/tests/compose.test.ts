import { describe, expect, it } from "bun:test"
import { Delta } from "../src/Delta"
import { $, pipe } from "./helpers"

describe("compose()", () => {
    it("insert + insert", () => {
        const a = Delta.insert([], "A")
        const b = Delta.insert([], "B")
        const expected = pipe([], $.insert("B"), $.insert("A"))
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("insert + retain", () => {
        const a = Delta.insert([], "A")
        const b = Delta.retain([], 1, { bold: true, color: "red", font: null })
        const expected = Delta.insert([], "A", { bold: true, color: "red" })
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("insert + remove", () => {
        const a = Delta.insert([], "A")
        const b = Delta.remove([], 1)
        const expected: Delta = []
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("remove + insert", () => {
        const a = Delta.remove([], 1)
        const b = Delta.insert([], "B")
        const expected = pipe([], $.insert("B"), $.remove(1))
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("remove + retain", () => {
        const a = Delta.remove([], 1)
        const b = Delta.retain([], 1, { bold: true, color: "red" })
        const expected = pipe(
            [],
            $.remove(1),
            $.retain(1, { bold: true, color: "red" }),
        )
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("remove + remove", () => {
        const a = Delta.remove([], 1)
        const b = Delta.remove([], 1)
        const expected = Delta.remove([], 2)
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain + insert", () => {
        const a = Delta.retain([], 1, { color: "blue" })
        const b = Delta.insert([], "B")
        const expected = pipe([], $.insert("B"), $.retain(1, { color: "blue" }))
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain + retain", () => {
        const a = Delta.retain([], 1, { color: "blue" })
        const b = Delta.retain([], 1, { bold: true, color: "red", font: null })
        const expected = Delta.retain([], 1, { bold: true, color: "red", font: null })
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain + remove", () => {
        const a = Delta.retain([], 1, { color: "blue" })
        const b = Delta.remove([], 1)
        const expected = Delta.remove([], 1)
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("insert in middle of text", () => {
        const a = Delta.insert([], "Hello")
        const b = pipe([], $.retain(3), $.insert("X"))
        const expected = Delta.insert([], "HelXlo")
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("insert and remove ordering", () => {
        const a = Delta.insert([], "Hello")
        const b = Delta.insert([], "Hello")
        const insertFirst = pipe([], $.retain(3), $.insert("X"), $.remove(1))
        const deleteFirst = pipe([], $.retain(3), $.remove(1), $.insert("X"))
        const expected = Delta.insert([], "HelXo")
        expect(Delta.compose(a, insertFirst)).toEqual(expected)
        expect(Delta.compose(b, deleteFirst)).toEqual(expected)
    })

    it("remove entire text", () => {
        const a = pipe([], $.retain(4), $.insert("Hello"))
        const b = Delta.remove([], 9)
        const expected = Delta.remove([], 4)
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain more than length of text", () => {
        const a = Delta.insert([], "Hello")
        const b = Delta.retain([], 10)
        const expected = Delta.insert([], "Hello")
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("remove all attributes", () => {
        const a = Delta.insert([], "A", { bold: true })
        const b = Delta.retain([], 1, { bold: null })
        const expected = Delta.insert([], "A")
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain start optimization", () => {
        const a = pipe(
            [],
            $.insert("A", { bold: true }),
            $.insert("B"),
            $.insert("C", { bold: true }),
            $.remove(1),
        )
        const b = pipe([], $.retain(3), $.insert("D"))
        const expected = pipe(
            [],
            $.insert("A", { bold: true }),
            $.insert("B"),
            $.insert("C", { bold: true }),
            $.insert("D"),
            $.remove(1),
        )
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain start optimization split", () => {
        const a = pipe(
            [],
            $.insert("A", { bold: true }),
            $.insert("B"),
            $.insert("C", { bold: true }),
            $.retain(5),
            $.remove(1),
        )
        const b = pipe([], $.retain(4), $.insert("D"))
        const expected = pipe(
            [],
            $.insert("A", { bold: true }),
            $.insert("B"),
            $.insert("C", { bold: true }),
            $.retain(1),
            $.insert("D"),
            $.retain(4),
            $.remove(1),
        )
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain end optimization", () => {
        const a = pipe(
            [],
            $.insert("A", { bold: true }),
            $.insert("B"),
            $.insert("C", { bold: true }),
        )
        const b = Delta.remove([], 1)
        const expected = pipe([], $.insert("B"), $.insert("C", { bold: true }))
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("insert embed + retain applies attributes to embed", () => {
        const a = Delta.insert([], { embed: 1 }, { src: "http://quilljs.com/image.png" })
        const b = Delta.retain([], 1, { alt: "logo" })
        const expected = Delta.insert([], { embed: 1 }, { alt: "logo", src: "http://quilljs.com/image.png" })
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain empty embed (retain(1) with no attributes passes embed through)", () => {
        const a = Delta.insert([], { embed: 1 })
        const b = Delta.retain([], 1)
        const expected = Delta.insert([], { embed: 1 })
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("remove all embed attributes", () => {
        const a = Delta.insert([], { embed: 2 }, { bold: true })
        const b = Delta.retain([], 1, { bold: null })
        const expected = Delta.insert([], { embed: 2 })
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain end optimization join", () => {
        const a = pipe(
            [],
            $.insert("A", { bold: true }),
            $.insert("B"),
            $.insert("C", { bold: true }),
            $.insert("D"),
            $.insert("E", { bold: true }),
            $.insert("F"),
        )
        const b = pipe([], $.retain(1), $.remove(1))
        const expected = pipe(
            [],
            $.insert("AC", { bold: true }),
            $.insert("D"),
            $.insert("E", { bold: true }),
            $.insert("F"),
        )
        expect(Delta.compose(a, b)).toEqual(expected)
    })
})
