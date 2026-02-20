import { describe, expect, it } from "vitest"
import { Op } from "../src/Op"

describe("Op.length()", () => {
    it("insert text", () => {
        expect(Op.length({ attributes: undefined, type: "insert", value: "text" })).toEqual(4)
    })

    it("insert embed", () => {
        expect(Op.length({ attributes: undefined, type: "insert", value: { embed: 2 } })).toEqual(1)
    })

    it("retain", () => {
        expect(Op.length({ attributes: undefined, type: "retain", value: 2 })).toEqual(2)
    })

    it("remove", () => {
        expect(Op.length({ attributes: undefined, type: "remove", value: 5 })).toEqual(5)
    })
})
