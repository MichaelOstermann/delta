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
            insert: { embed: 2 },
            attributes: { src: "http://quilljs.com/" },
        })
    })

    it("next() with length=1 returns embed whole", () => {
        const iter = OpIterator.create(ops)
        OpIterator.next(iter) // consume Hello
        OpIterator.next(iter) // consume retain(3)
        expect(OpIterator.next(iter, 1)).toEqual({
            insert: { embed: 2 },
            attributes: { src: "http://quilljs.com/" },
        })
    })

    it("rest() includes embed op", () => {
        const iter = OpIterator.create(ops)
        OpIterator.next(iter, 2) // consume 'He'
        expect(OpIterator.rest(iter)).toEqual([
            { insert: "llo", attributes: { bold: true } },
            { retain: 3, attributes: undefined },
            { insert: { embed: 2 }, attributes: { src: "http://quilljs.com/" } },
            { delete: 4 },
        ])
    })

    it("rest() after consuming up to embed", () => {
        const iter = OpIterator.create(ops)
        OpIterator.next(iter, 2) // He
        OpIterator.next(iter, 3) // llo
        OpIterator.next(iter, 3) // retain(3)
        expect(OpIterator.rest(iter)).toEqual([
            { insert: { embed: 2 }, attributes: { src: "http://quilljs.com/" } },
            { delete: 4 },
        ])
    })
})
