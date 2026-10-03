import type { EmbedValue, Op } from "../src/Op"
import type { OpAttributes } from "../src/OpAttributes"
import { Delta } from "../src/Delta"

type Step = (ops: Delta) => Delta

/** Describes a delta as a series of steps: `pipe([], $.retain(1), $.insert("A"))`. */
export function pipe(ops: Delta, ...steps: Step[]): Delta {
    return steps.reduce((ops, step) => step(ops), ops)
}

export const $ = {
    insert: (content: string | EmbedValue, attributes?: OpAttributes | null): Step => ops => Delta.insert(ops, content, attributes),
    push: (op: Op): Step => ops => Delta.push(ops, op),
    remove: (length: number): Step => ops => Delta.remove(ops, length),
    retain: (length: number, attributes?: OpAttributes | null): Step => ops => Delta.retain(ops, length, attributes),
}
