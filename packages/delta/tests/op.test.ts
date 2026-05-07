import { describe, expect, it } from "vitest"
import { Op } from "../src/Op"

describe("Op.length()", () => {
    it("insert text", () => {
        expect(Op.length({ insert: "text", attributes: undefined })).toEqual(4)
    })

    it("insert embed", () => {
        expect(Op.length({ insert: { embed: 2 }, attributes: undefined })).toEqual(1)
    })

    it("retain", () => {
        expect(Op.length({ retain: 2, attributes: undefined })).toEqual(2)
    })

    it("remove", () => {
        expect(Op.length({ delete: 5 })).toEqual(5)
    })
})
