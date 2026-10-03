import { describe, expect, it } from "bun:test"
import { Delta } from "../src/Delta"
import { $, pipe } from "./helpers"

describe("insert()", () => {
    it("insert(text)", () => {
        const delta = Delta.insert([], "test")
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, insert: "test" })
    })

    it("insert(text, null)", () => {
        const delta = Delta.insert([], "test", null)
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, insert: "test" })
    })

    it("insert(text, attributes)", () => {
        const delta = Delta.insert([], "test", { bold: true })
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({
            attributes: { bold: true },
            insert: "test",
        })
    })

    it("insert(text) after delete", () => {
        const delta = pipe(
            [],
            $.remove(1),
            $.insert("a"),
        )
        const expected = pipe(
            [],
            $.insert("a"),
            $.remove(1),
        )
        expect(delta).toEqual(expected)
    })

    it("insert(text) after delete with merge", () => {
        const delta = pipe(
            [],
            $.insert("a"),
            $.remove(1),
            $.insert("b"),
        )
        const expected = pipe(
            [],
            $.insert("ab"),
            $.remove(1),
        )
        expect(delta).toEqual(expected)
    })

    it("insert(text, {})", () => {
        const delta = pipe([], $.insert("a", {}))
        const expected = pipe([], $.insert("a"))
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
        expect(delta[0]).toEqual({ delete: 1 })
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
        expect(delta[0]).toEqual({ attributes: undefined, retain: 2 })
    })

    it("retain(length, null)", () => {
        const delta = Delta.retain([], 2, null)
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, retain: 2 })
    })

    it("retain(length, attributes)", () => {
        const delta = Delta.retain([], 1, { bold: true })
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: { bold: true }, retain: 1 })
    })

    it("retain(length, {})", () => {
        const delta = pipe(
            [],
            $.retain(2, {}),
            $.remove(1), // Delete prevents chop
        )
        const expected = pipe(
            [],
            $.retain(2),
            $.remove(1),
        )
        expect(delta).toEqual(expected)
    })
})

describe("push()", () => {
    it("push(op) into empty", () => {
        const delta = Delta.push([], { attributes: undefined, insert: "test" })
        expect(delta.length).toEqual(1)
    })

    it("push(op) consecutive remove", () => {
        const delta = pipe(
            [],
            $.remove(2),
            $.push({ delete: 3 }),
        )
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ delete: 5 })
    })

    it("push(op) consecutive text", () => {
        const delta = pipe(
            [],
            $.insert("a"),
            $.push({ attributes: undefined, insert: "b" }),
        )
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, insert: "ab" })
    })

    it("push(op) consecutive texts with matching attributes", () => {
        const delta = pipe(
            [],
            $.insert("a", { bold: true }),
            $.push({ attributes: { bold: true }, insert: "b" }),
        )
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: { bold: true }, insert: "ab" })
    })

    it("push(op) consecutive retains with matching attributes", () => {
        const delta = pipe(
            [],
            $.retain(1, { bold: true }),
            $.push({ attributes: { bold: true }, retain: 3 }),
        )
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: { bold: true }, retain: 4 })
    })

    it("push(op) consecutive texts with mismatched attributes", () => {
        const delta = pipe(
            [],
            $.insert("a", { bold: true }),
            $.push({ attributes: undefined, insert: "b" }),
        )
        expect(delta.length).toEqual(2)
    })

    it("push(op) consecutive retains with mismatched attributes", () => {
        const delta = pipe(
            [],
            $.retain(1, { bold: true }),
            $.push({ attributes: undefined, retain: 3 }),
        )
        expect(delta.length).toEqual(2)
    })

    it("push(op) consecutive embeds with matching attributes are not merged", () => {
        const delta = pipe(
            [],
            $.insert({ embed: 1 }, { alt: "Description" }),
            $.push({ attributes: { alt: "Description" }, insert: { url: "http://quilljs.com" } }),
        )
        expect(delta.length).toEqual(2)
    })
})

describe("insert() embed", () => {
    it("insert(embed)", () => {
        const delta = Delta.insert([], { embed: 1 })
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({ attributes: undefined, insert: { embed: 1 } })
    })

    it("insert(embed, attributes)", () => {
        const delta = Delta.insert([], { embed: 1 }, { alt: "Quill", url: "http://quilljs.com" })
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({
            attributes: { alt: "Quill", url: "http://quilljs.com" },
            insert: { embed: 1 },
        })
    })

    it("insert(embed) with non-integer value", () => {
        const embed = { url: "http://quilljs.com" }
        const delta = Delta.insert([], embed, { alt: "Quill" })
        expect(delta.length).toEqual(1)
        expect(delta[0]).toEqual({
            attributes: { alt: "Quill" },
            insert: { url: "http://quilljs.com" },
        })
    })

    it("insert(text) after embed+delete does not merge text with embed", () => {
        const delta = pipe(
            [],
            $.insert({ embed: 1 }),
            $.remove(1),
            $.insert("a"),
        )
        const expected = pipe(
            [],
            $.insert({ embed: 1 }),
            $.insert("a"),
            $.remove(1),
        )
        expect(delta).toEqual(expected)
    })
})
