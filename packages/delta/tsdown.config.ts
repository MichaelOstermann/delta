import treeshake from "@monstermann/unplugin-tree-shake-import-namespaces/rolldown"
import { defineConfig } from "tsdown"
// importAlias: '_isEqual',
//   importName: 'OpAttributes',
//   importPath: '../OpAttributes',
//   localName: 'OpAttributes',
//   propertyName: 'isEqual',
export default defineConfig({
    clean: true,
    dts: true,
    entry: ["./src/index.ts"],
    format: "esm",
    unbundle: true,
    plugins: [treeshake({
        resolve({ importAlias, importName, importPath, propertyName }) {
            if (["OpAttributes", "OpIterator", "Delta", "Op"].includes(importName || "")) {
                return `import { ${propertyName} as ${importAlias} } from "${importPath}/${propertyName}.ts"`
            }
            return undefined
        },
    })],
})
