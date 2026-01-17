import type { Op } from "../Op"
import type { OpAttributes } from "../OpAttributes"

export type Delta<T extends OpAttributes = OpAttributes> = Op<T>[]
