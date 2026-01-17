import { pipe } from "@monstermann/dfdl"
import { describe, expect, it } from "vitest"
import { Delta } from "../src/Delta"

describe("chop()", () => {
    it("removes trailing retain without attributes", () => {
        const delta = pipe([], Delta.insert("Hello"), Delta.retain(5))
        expect(Delta.chop(delta)).toEqual([
            { attributes: undefined, type: "insert", value: "Hello" },
        ])
    })

    it("keeps trailing retain with attributes", () => {
        const delta = pipe([], Delta.insert("Hello"), Delta.retain(5, { bold: true }))
        expect(Delta.chop(delta)).toEqual([
            { attributes: undefined, type: "insert", value: "Hello" },
            { attributes: { bold: true }, type: "retain", value: 5 },
        ])
    })

    it("returns same delta if no trailing retain", () => {
        const delta = Delta.insert([], "Hello")
        expect(Delta.chop(delta)).toBe(delta)
    })

    it("returns same delta if trailing is not retain", () => {
        const delta = pipe([], Delta.insert("Hello"), Delta.remove(3))
        expect(Delta.chop(delta)).toBe(delta)
    })

    it("returns empty for empty delta", () => {
        expect(Delta.chop([])).toEqual([])
    })

    it("removes retain-only delta without attributes", () => {
        const delta = Delta.retain([], 5)
        expect(Delta.chop(delta)).toEqual([])
    })
})
