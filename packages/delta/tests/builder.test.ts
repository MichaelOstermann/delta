import { pipe } from "@monstermann/dfdl"
import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("insert()", () => {
    it("insert(text)", () => {
        const delta = Delta.insert([], "test")
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, type: "insert", value: "test" })
    })

    it("insert(text, null)", () => {
        const delta = Delta.insert([], "test", null)
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, type: "insert", value: "test" })
    })

    it("insert(text, attributes)", () => {
        const delta = Delta.insert([], "test", { bold: true })
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({
            attributes: { bold: true },
            type: "insert",
            value: "test",
        })
    })

    it("insert(text) after delete", () => {
        const delta = pipe(
            [],
            Delta.remove(1),
            Delta.insert("a"),
        )
        const expected = pipe(
            [],
            Delta.insert("a"),
            Delta.remove(1),
        )
        expect(delta).toEqual(expected)
    })

    it("insert(text) after delete with merge", () => {
        const delta = pipe(
            [],
            Delta.insert("a"),
            Delta.remove(1),
            Delta.insert("b"),
        )
        const expected = pipe(
            [],
            Delta.insert("ab"),
            Delta.remove(1),
        )
        expect(delta).toEqual(expected)
    })

    it("insert(text, {})", () => {
        const delta = pipe([], Delta.insert("a", {}))
        const expected = pipe([], Delta.insert("a"))
        expect(delta).toEqual(expected)
    })
})

describe("remove()", () => {
    it("remove(0)", () => {
        const delta = Delta.remove([], 0)
        expect(delta.length).toEqual(0)
    })

    it("remove(positive)", () => {
        const delta = Delta.remove([], 1)
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, type: "remove", value: 1 })
    })
})

describe("retain()", () => {
    it("retain(0)", () => {
        const delta = Delta.retain([], 0)
        expect(delta.length).toEqual(0)
    })

    it("retain(length)", () => {
        const delta = Delta.retain([], 2)
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, type: "retain", value: 2 })
    })

    it("retain(length, null)", () => {
        const delta = Delta.retain([], 2, null)
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, type: "retain", value: 2 })
    })

    it("retain(length, attributes)", () => {
        const delta = Delta.retain([], 1, { bold: true })
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: { bold: true }, type: "retain", value: 1 })
    })

    it("retain(length, {})", () => {
        const delta = pipe(
            [],
            Delta.retain(2, {}),
            Delta.remove(1), // Delete prevents chop
        )
        const expected = pipe(
            [],
            Delta.retain(2),
            Delta.remove(1),
        )
        expect(delta).toEqual(expected)
    })
})

describe("push()", () => {
    it("push(op) into empty", () => {
        const delta = Delta.push([], { attributes: undefined, type: "insert", value: "test" })
        expect(delta.length).toEqual(1)
    })

    it("push(op) consecutive remove", () => {
        const delta = pipe(
            [],
            Delta.remove(2),
            Delta.push({ attributes: undefined, type: "remove", value: 3 }),
        )
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, type: "remove", value: 5 })
    })

    it("push(op) consecutive text", () => {
        const delta = pipe(
            [],
            Delta.insert("a"),
            Delta.push({ attributes: undefined, type: "insert", value: "b" }),
        )
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, type: "insert", value: "ab" })
    })

    it("push(op) consecutive texts with matching attributes", () => {
        const delta = pipe(
            [],
            Delta.insert("a", { bold: true }),
            Delta.push({ attributes: { bold: true }, type: "insert", value: "b" }),
        )
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: { bold: true }, type: "insert", value: "ab" })
    })

    it("push(op) consecutive retains with matching attributes", () => {
        const delta = pipe(
            [],
            Delta.retain(1, { bold: true }),
            Delta.push({ attributes: { bold: true }, type: "retain", value: 3 }),
        )
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: { bold: true }, type: "retain", value: 4 })
    })

    it("push(op) consecutive texts with mismatched attributes", () => {
        const delta = pipe(
            [],
            Delta.insert("a", { bold: true }),
            Delta.push({ attributes: undefined, type: "insert", value: "b" }),
        )
        expect(delta.length).toEqual(2)
    })

    it("push(op) consecutive retains with mismatched attributes", () => {
        const delta = pipe(
            [],
            Delta.retain(1, { bold: true }),
            Delta.push({ attributes: undefined, type: "retain", value: 3 }),
        )
        expect(delta.length).toEqual(2)
    })

    it("push(op) consecutive embeds with matching attributes are not merged", () => {
        const delta = pipe(
            [],
            Delta.insert({ embed: 1 }, { alt: "Description" }),
            Delta.push({ attributes: { alt: "Description" }, type: "insert", value: { url: "http://quilljs.com" } }),
        )
        expect(delta.length).toEqual(2)
    })
})

describe("insert() embed", () => {
    it("insert(embed)", () => {
        const delta = Delta.insert([], { embed: 1 })
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, type: "insert", value: { embed: 1 } })
    })

    it("insert(embed, attributes)", () => {
        const delta = Delta.insert([], { embed: 1 }, { alt: "Quill", url: "http://quilljs.com" })
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({
            attributes: { alt: "Quill", url: "http://quilljs.com" },
            type: "insert",
            value: { embed: 1 },
        })
    })

    it("insert(embed) with non-integer value", () => {
        const embed = { url: "http://quilljs.com" }
        const delta = Delta.insert([], embed, { alt: "Quill" })
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({
            attributes: { alt: "Quill" },
            type: "insert",
            value: { url: "http://quilljs.com" },
        })
    })

    it("insert(text) after embed+delete does not merge text with embed", () => {
        const delta = pipe(
            [],
            Delta.insert({ embed: 1 }),
            Delta.remove(1),
            Delta.insert("a"),
        )
        const expected = pipe(
            [],
            Delta.insert({ embed: 1 }),
            Delta.insert("a"),
            Delta.remove(1),
        )
        expect(delta).toEqual(expected)
    })
})
