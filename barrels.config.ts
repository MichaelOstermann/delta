import { defineConfig } from "@monstermann/barrels"
import { flat } from "@monstermann/barrels-flat"
import { namespace } from "@monstermann/barrels-namespace"

export default defineConfig([
    namespace({
        entries: "./packages/delta/src/Delta",
    }),
    flat({
        entries: "./packages/delta/src",
        include: ["*", "Op/index.js", "Delta/index.js"],
    }),
])
