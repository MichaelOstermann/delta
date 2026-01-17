import type { NullableOpAttributes } from "../src/OpAttributes"
import { describe, expect, it } from "vitest"
import { OpAttributes } from "../src/OpAttributes"

describe("OpAttributes", () => {
    describe("compose()", () => {
        const attributes = { bold: true, color: "red" } as { bold: boolean, color: string, italic: boolean }

        it("left is undefined", () => {
            expect(OpAttributes.compose(undefined, attributes)).toEqual(attributes)
        })

        it("right is undefined", () => {
            expect(OpAttributes.compose(attributes, undefined)).toEqual(attributes)
        })

        it("both are undefined", () => {
            expect(OpAttributes.compose(undefined, undefined)).toBe(undefined)
        })

        it("missing", () => {
            expect(OpAttributes.compose(attributes, { italic: true })).toEqual({
                bold: true,
                color: "red",
                italic: true,
            })
        })

        it("overwrite", () => {
            expect(
                OpAttributes.compose(attributes, { bold: false, color: "blue" }),
            ).toEqual({
                bold: false,
                color: "blue",
            })
        })

        it("remove", () => {
            expect(OpAttributes.compose(attributes, { bold: null })).toEqual({
                color: "red",
            })
        })

        it("remove to none", () => {
            expect(
                OpAttributes.compose(attributes, { bold: null, color: null }),
            ).toEqual(undefined)
        })

        it("remove missing", () => {
            expect(OpAttributes.compose(attributes, { italic: null })).toEqual(
                attributes,
            )
        })
    })

    describe("diff()", () => {
        const format = { bold: true, color: "red" }

        it("left is undefined", () => {
            expect(OpAttributes.diff(undefined, format)).toEqual(format)
        })

        it("right is undefined", () => {
            const expected = { bold: null, color: null }
            expect(OpAttributes.diff(format, undefined)).toEqual(expected)
        })

        it("same format", () => {
            expect(OpAttributes.diff(format, format)).toEqual(undefined)
        })

        it("add format", () => {
            const added = { bold: true, color: "red", italic: true }
            const expected = { italic: true }
            expect(OpAttributes.diff(format, added)).toEqual(expected)
        })

        it("remove format", () => {
            const removed = { bold: true }
            const expected = { color: null }
            expect(OpAttributes.diff(format, removed)).toEqual(expected)
        })

        it("overwrite format", () => {
            const overwritten = { bold: true, color: "blue" }
            const expected = { color: "blue" }
            expect(OpAttributes.diff(format, overwritten)).toEqual(expected)
        })
    })

    describe("invert()", () => {
        it("attributes is undefined", () => {
            const base = { bold: true }
            expect(OpAttributes.invert(undefined, base)).toEqual({})
        })

        it("base is undefined", () => {
            const attributes = { bold: true }
            const expected = { bold: null }
            expect(OpAttributes.invert(attributes, undefined)).toEqual(expected)
        })

        it("both undefined", () => {
            expect(OpAttributes.invert(undefined, undefined)).toEqual({})
        })

        it("merge", () => {
            const attributes = { bold: true } as { bold: boolean, italic: boolean }
            const base = { italic: true }
            const expected = { bold: null }
            expect(OpAttributes.invert(attributes, base)).toEqual(expected)
        })

        it("null", () => {
            const attributes = { bold: null } as NullableOpAttributes<{ bold: boolean, italic: boolean }>
            const base = { bold: true }
            const expected = { bold: true }
            expect(OpAttributes.invert(attributes, base)).toEqual(expected)
        })

        it("replace", () => {
            const attributes = { color: "red" }
            const base = { color: "blue" }
            const expected = base
            expect(OpAttributes.invert(attributes, base)).toEqual(expected)
        })

        it("noop", () => {
            const attributes = { color: "red" }
            const base = { color: "red" }
            const expected = {}
            expect(OpAttributes.invert(attributes, base)).toEqual(expected)
        })

        it("combined", () => {
            const attributes = {
                bold: true,
                color: "red",
                italic: null,
                size: "12px",
            } as NullableOpAttributes<{ bold: boolean, color: string, italic: boolean, size: string }>
            const base = { color: "blue", font: "serif", italic: true, size: "12px" }
            const expected = { bold: null, color: "blue", italic: true }
            expect(OpAttributes.invert(attributes, base)).toEqual(expected)
        })
    })

    describe("transform()", () => {
        const left = { bold: true, color: "red", font: null } as NullableOpAttributes<{ bold: boolean, color: string, font: string, italic: boolean }>
        const right = { color: "blue", font: "serif", italic: true } as NullableOpAttributes<{ bold: boolean, color: string, font: string, italic: boolean }>

        it("left is undefined", () => {
            expect(OpAttributes.transform(undefined, left, false)).toEqual(left)
        })

        it("right is undefined", () => {
            expect(OpAttributes.transform(left, undefined, false)).toEqual(undefined)
        })

        it("both are undefined", () => {
            expect(OpAttributes.transform(undefined, undefined, false)).toEqual(
                undefined,
            )
        })

        it("with priority", () => {
            expect(OpAttributes.transform(left, right, true)).toEqual({
                italic: true,
            })
        })

        it("without priority", () => {
            expect(OpAttributes.transform(left, right, false)).toEqual(right)
        })
    })
})
