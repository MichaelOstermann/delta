import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("batch()", () => {
    it("first change copies, next changes mutate, then copies again outside", () => {
        const original = Delta.insert([], "Hello")

        const batched = Delta.batch(original, (d) => {
            // First change should copy
            const first = Delta.insert(d, " world")
            expect(first).not.toBe(d)

            // Second change should mutate
            const second = Delta.insert(first, "!")
            expect(second).toBe(first)

            return second
        })

        // Original should be unchanged
        expect(original).toEqual([
            { attributes: undefined, type: "insert", value: "Hello" },
        ])

        // Batched result
        expect(batched).toEqual([
            { attributes: undefined, type: "insert", value: "Hello world!" },
        ])

        // After batch, operations should copy again
        const afterBatch = Delta.insert(batched, "?")
        expect(afterBatch).not.toBe(batched)
    })
})
