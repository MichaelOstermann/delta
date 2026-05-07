import { describe, expect, it } from "vitest"
import { Op } from "../src/Op"

describe("Op.length()", () => {
    it("insert text", () => {
        expect(Op.length({ attributes: undefined, insert: "text" })).toEqual(4)
    })

    it("insert embed", () => {
        expect(Op.length({ attributes: undefined, insert: { embed: 2 } })).toEqual(1)
    })

    it("retain", () => {
        expect(Op.length({ attributes: undefined, retain: 2 })).toEqual(2)
    })

    it("remove", () => {
        expect(Op.length({ delete: 5 })).toEqual(5)
    })
})
