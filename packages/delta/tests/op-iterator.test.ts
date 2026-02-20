import { pipe } from "@monstermann/dfdl"
import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"
import { OpIterator } from "../src/OpIterator"

// Delta with an embed: Hello(bold) | retain(3) | embed(src) | remove(4)
const ops = pipe(
    [],
    Delta.insert("Hello", { bold: true }),
    Delta.retain(3),
    Delta.insert({ embed: 2 }, { src: "http://quilljs.com/" }),
    Delta.remove(4),
)

describe("OpIterator (embed)", () => {
    it("peekLength() returns 1 for embed", () => {
        const iter = OpIterator.create(ops)
        OpIterator.next(iter) // consume Hello
        OpIterator.next(iter) // consume retain(3)
        expect(OpIterator.peekLength(iter)).toEqual(1)
    })

    it("next() returns embed whole, not sliced", () => {
        const iter = OpIterator.create(ops)
        OpIterator.next(iter) // consume Hello
        OpIterator.next(iter) // consume retain(3)
        expect(OpIterator.next(iter)).toEqual({
            attributes: { src: "http://quilljs.com/" },
            type: "insert",
            value: { embed: 2 },
        })
    })

    it("next() with length=1 returns embed whole", () => {
        const iter = OpIterator.create(ops)
        OpIterator.next(iter) // consume Hello
        OpIterator.next(iter) // consume retain(3)
        expect(OpIterator.next(iter, 1)).toEqual({
            attributes: { src: "http://quilljs.com/" },
            type: "insert",
            value: { embed: 2 },
        })
    })

    it("rest() includes embed op", () => {
        const iter = OpIterator.create(ops)
        OpIterator.next(iter, 2) // consume 'He'
        expect(OpIterator.rest(iter)).toEqual([
            { attributes: { bold: true }, type: "insert", value: "llo" },
            { attributes: undefined, type: "retain", value: 3 },
            { attributes: { src: "http://quilljs.com/" }, type: "insert", value: { embed: 2 } },
            { attributes: undefined, type: "remove", value: 4 },
        ])
    })

    it("rest() after consuming up to embed", () => {
        const iter = OpIterator.create(ops)
        OpIterator.next(iter, 2) // He
        OpIterator.next(iter, 3) // llo
        OpIterator.next(iter, 3) // retain(3)
        expect(OpIterator.rest(iter)).toEqual([
            { attributes: { src: "http://quilljs.com/" }, type: "insert", value: { embed: 2 } },
            { attributes: undefined, type: "remove", value: 4 },
        ])
    })
})
