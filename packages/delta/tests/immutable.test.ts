import { describe, expect, it } from "bun:test"
import { Delta } from "../src/Delta"

function frozen(ops: Delta): Delta {
    for (const op of ops) Object.freeze(op)
    return Object.freeze(ops) as Delta
}

describe("immutability", () => {
    const a = (): Delta => frozen([{ insert: "Hello" }, { attributes: { bold: true }, insert: " world" }, { delete: 2 }])
    const b = (): Delta => frozen([{ retain: 3 }, { insert: "X" }, { attributes: { bold: null }, retain: 4 }, { delete: 1 }])

    it("should not modify the deltas that are passed in", () => {
        // Throws in strict mode when something writes to a frozen delta or operation.
        Delta.push(a(), { insert: "!" })
        Delta.push(a(), { delete: 1 })
        Delta.insert(a(), "!")
        Delta.retain(a(), 2)
        Delta.remove(a(), 2)
        Delta.chop(frozen([{ insert: "a" }, { retain: 1 }]))
        Delta.clean(frozen([{ insert: "a" }, { insert: "b" }]))
        Delta.concat(a(), b())
        Delta.compose(a(), b())
        Delta.transform(a(), b())
        Delta.invert(b(), frozen([{ insert: "Hello world" }]))
        Delta.diff(frozen([{ insert: "Hello" }]), frozen([{ insert: "Help" }]))
        Delta.slice(a(), 2, 8)
        expect(a()).toEqual([{ insert: "Hello" }, { attributes: { bold: true }, insert: " world" }, { delete: 2 }])
    })

    it("should return a new delta when something changed", () => {
        const ops = a()
        expect(Delta.push(ops, { insert: "!" })).not.toBe(ops)
        expect(Delta.insert(ops, "!")).not.toBe(ops)
        expect(Delta.chop(frozen([{ insert: "a" }, { retain: 1 }]))).toEqual([{ insert: "a" }])
    })

    it("should return the same delta when nothing changed", () => {
        const ops = a()
        expect(Delta.insert(ops, "")).toBe(ops)
        expect(Delta.retain(ops, 0)).toBe(ops)
        expect(Delta.remove(ops, 0)).toBe(ops)
        expect(Delta.chop(ops)).toBe(ops)
        expect(Delta.clean(ops)).toBe(ops)
    })
})
