import { pipe } from "@monstermann/dfdl"
import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("compose()", () => {
    it("insert + insert", () => {
        const a = Delta.insert([], "A")
        const b = Delta.insert([], "B")
        const expected = pipe([], Delta.insert("B"), Delta.insert("A"))
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
        const expected: Delta<any>[] = []
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("remove + insert", () => {
        const a = Delta.remove([], 1)
        const b = Delta.insert([], "B")
        const expected = pipe([], Delta.insert("B"), Delta.remove(1))
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("remove + retain", () => {
        const a = Delta.remove([], 1)
        const b = Delta.retain([], 1, { bold: true, color: "red" })
        const expected = pipe(
            [],
            Delta.remove(1),
            Delta.retain(1, { bold: true, color: "red" }),
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
        const expected = pipe([], Delta.insert("B"), Delta.retain(1, { color: "blue" }))
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
        const b = pipe([], Delta.retain(3), Delta.insert("X"))
        const expected = Delta.insert([], "HelXlo")
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("insert and remove ordering", () => {
        const a = Delta.insert([], "Hello")
        const b = Delta.insert([], "Hello")
        const insertFirst = pipe([], Delta.retain(3), Delta.insert("X"), Delta.remove(1))
        const deleteFirst = pipe([], Delta.retain(3), Delta.remove(1), Delta.insert("X"))
        const expected = Delta.insert([], "HelXo")
        expect(Delta.compose(a, insertFirst)).toEqual(expected)
        expect(Delta.compose(b, deleteFirst)).toEqual(expected)
    })

    it("remove entire text", () => {
        const a = pipe([], Delta.retain(4), Delta.insert("Hello"))
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
            Delta.insert("A", { bold: true }),
            Delta.insert("B"),
            Delta.insert("C", { bold: true }),
            Delta.remove(1),
        )
        const b = pipe([], Delta.retain(3), Delta.insert("D"))
        const expected = pipe(
            [],
            Delta.insert("A", { bold: true }),
            Delta.insert("B"),
            Delta.insert("C", { bold: true }),
            Delta.insert("D"),
            Delta.remove(1),
        )
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain start optimization split", () => {
        const a = pipe(
            [],
            Delta.insert("A", { bold: true }),
            Delta.insert("B"),
            Delta.insert("C", { bold: true }),
            Delta.retain(5),
            Delta.remove(1),
        )
        const b = pipe([], Delta.retain(4), Delta.insert("D"))
        const expected = pipe(
            [],
            Delta.insert("A", { bold: true }),
            Delta.insert("B"),
            Delta.insert("C", { bold: true }),
            Delta.retain(1),
            Delta.insert("D"),
            Delta.retain(4),
            Delta.remove(1),
        )
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain end optimization", () => {
        const a = pipe(
            [],
            Delta.insert("A", { bold: true }),
            Delta.insert("B"),
            Delta.insert("C", { bold: true }),
        )
        const b = Delta.remove([], 1)
        const expected = pipe([], Delta.insert("B"), Delta.insert("C", { bold: true }))
        expect(Delta.compose(a, b)).toEqual(expected)
    })

    it("retain end optimization join", () => {
        const a = pipe(
            [],
            Delta.insert("A", { bold: true }),
            Delta.insert("B"),
            Delta.insert("C", { bold: true }),
            Delta.insert("D"),
            Delta.insert("E", { bold: true }),
            Delta.insert("F"),
        )
        const b = pipe([], Delta.retain(1), Delta.remove(1))
        const expected = pipe(
            [],
            Delta.insert("AC", { bold: true }),
            Delta.insert("D"),
            Delta.insert("E", { bold: true }),
            Delta.insert("F"),
        )
        expect(Delta.compose(a, b)).toEqual(expected)
    })
})
