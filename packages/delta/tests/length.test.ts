import { describe, expect, it } from "bun:test"
import { Delta } from "../src/Delta"
import { $, pipe } from "./helpers"

describe("length()", () => {
    it("returns 0 for empty delta", () => {
        expect(Delta.length([])).toBe(0)
    })

    it("returns length of insert", () => {
        const delta = Delta.insert([], "Hello")
        expect(Delta.length(delta)).toBe(5)
    })

    it("returns length of remove", () => {
        const delta = Delta.remove([], 7)
        expect(Delta.length(delta)).toBe(7)
    })

    it("returns length of retain", () => {
        const delta = Delta.retain([], 3)
        expect(Delta.length(delta)).toBe(3)
    })

    it("sums multiple operations", () => {
        const delta = pipe(
            [],
            $.insert("Hello"),
            $.retain(3),
            $.remove(2),
        )
        expect(Delta.length(delta)).toBe(10)
    })
})
