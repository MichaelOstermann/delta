import { pipe } from "@monstermann/dfdl"
import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("transform()", () => {
    it("insert + insert", () => {
        const a = Delta.insert([], "A")
        const b = Delta.insert([], "B")
        const expected1 = pipe([], Delta.retain(1), Delta.insert("B"))
        const expected2 = Delta.insert([], "B")
        expect(Delta.transform(a, b, true)).toEqual(expected1)
        expect(Delta.transform(a, b, false)).toEqual(expected2)
    })

    it("insert + retain", () => {
        const a = Delta.insert([], "A")
        const b = Delta.retain([], 1, { bold: true, color: "red" })
        const expected = pipe(
            [],
            Delta.retain(1),
            Delta.retain(1, { bold: true, color: "red" }),
        )
        expect(Delta.transform(a, b, true)).toEqual(expected)
    })

    it("insert + remove", () => {
        const a = Delta.insert([], "A")
        const b = Delta.remove([], 1)
        const expected = pipe([], Delta.retain(1), Delta.remove(1))
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
        const expected: Delta<any>[] = []
        expect(Delta.transform(a, b, true)).toEqual(expected)
    })

    it("remove + remove", () => {
        const a = Delta.remove([], 1)
        const b = Delta.remove([], 1)
        const expected: Delta<any>[] = []
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
        const expected2: Delta<any>[] = []
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
        const a = pipe([], Delta.retain(2), Delta.insert("si"), Delta.remove(5))
        const b = pipe(
            [],
            Delta.retain(1),
            Delta.insert("e"),
            Delta.remove(5),
            Delta.retain(1),
            Delta.insert("ow"),
        )
        const expected1 = pipe(
            [],
            Delta.retain(1),
            Delta.insert("e"),
            Delta.remove(1),
            Delta.retain(2),
            Delta.insert("ow"),
        )
        const expected2 = pipe([], Delta.retain(2), Delta.insert("si"), Delta.remove(1))
        expect(Delta.transform(a, b, false)).toEqual(expected1)
        expect(Delta.transform(b, a, false)).toEqual(expected2)
    })

    it("conflicting appends", () => {
        const a = pipe([], Delta.retain(3), Delta.insert("aa"))
        const b = pipe([], Delta.retain(3), Delta.insert("bb"))
        const expected1 = pipe([], Delta.retain(5), Delta.insert("bb"))
        const expected2 = pipe([], Delta.retain(3), Delta.insert("aa"))
        expect(Delta.transform(a, b, true)).toEqual(expected1)
        expect(Delta.transform(b, a, false)).toEqual(expected2)
    })

    it("prepend + append", () => {
        const a = Delta.insert([], "aa")
        const b = pipe([], Delta.retain(3), Delta.insert("bb"))
        const expected1 = pipe([], Delta.retain(5), Delta.insert("bb"))
        const expected2 = Delta.insert([], "aa")
        expect(Delta.transform(a, b, false)).toEqual(expected1)
        expect(Delta.transform(b, a, false)).toEqual(expected2)
    })

    it("trailing removes with differing lengths", () => {
        const a = pipe([], Delta.retain(2), Delta.remove(1))
        const b = Delta.remove([], 3)
        const expected1 = Delta.remove([], 2)
        const expected2: Delta<any>[] = []
        expect(Delta.transform(a, b, false)).toEqual(expected1)
        expect(Delta.transform(b, a, false)).toEqual(expected2)
    })

    it("immutability", () => {
        const a1 = Delta.insert([], "A")
        const a2 = Delta.insert([], "A")
        const b1 = Delta.insert([], "B")
        const b2 = Delta.insert([], "B")
        const expected = pipe([], Delta.retain(1), Delta.insert("B"))
        expect(Delta.transform(a1, b1, true)).toEqual(expected)
        expect(a1).toEqual(a2)
        expect(b1).toEqual(b2)
    })
})
