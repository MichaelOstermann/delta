import { defineConfig, flat, namespace } from "@monstermann/barrels"

export default defineConfig([
    namespace({
        entries: "./packages/delta/src/[A-Z]*",
    }),
    flat({
        entries: "./packages/delta/src",
        include: ["Op/index.js", "Delta/index.js"],
    }),
])
