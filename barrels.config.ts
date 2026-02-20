import { defineConfig } from "@monstermann/barrels"
import { flat } from "@monstermann/barrels-flat"
import { namespace } from "@monstermann/barrels-namespace"

export default defineConfig([
    namespace({
        entries: [
            "./packages/delta/src/Op",
            "./packages/delta/src/Delta",
            "./packages/delta/src/OpAttributes",
            "./packages/delta/src/OpIterator",
        ],
    }),
    flat({
        entries: "./packages/delta/src",
        include: ["*", "Op/index.js", "Delta/index.js"],
    }),
])
