import { treeshake } from "@monstermann/barrels-treeshake"
import { defineConfig } from "tsdown"

const namespaces = ["Delta", "Op", "OpAttributes", "OpIterator"]

export default defineConfig({
    clean: true,
    dts: true,
    entry: ["./src/index.ts"],
    format: "esm",
    unbundle: true,
    plugins: [treeshake({
        resolve({ importAlias, importName, importPath, propertyName }) {
            if (!importName || !namespaces.includes(importName)) return
            return `import { ${propertyName} as ${importAlias} } from "${importPath}/${propertyName}.ts"`
        },
    })],
})
