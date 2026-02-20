import { defineConfig } from "vitepress"
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons"

export default defineConfig({
    base: "/delta/",
    description: "Functional operational-transform.",
    title: "delta",
    markdown: {
        theme: {
            dark: "catppuccin-macchiato",
            light: "github-light-default",
        },
        config(md) {
            md.use(groupIconMdPlugin)
        },
    },
    themeConfig: {
        aside: false,
        outline: "deep",
        docFooter: {
            next: false,
            prev: false,
        },
        search: {
            provider: "local",
        },
        sidebar: [
            { base: "/Op/", text: "Op", items: [
                { link: "length", text: "length" },
            ] },
            { base: "/Delta/", text: "Delta", items: [
                { link: "batch", text: "batch" },
                { link: "chop", text: "chop" },
                { link: "clean", text: "clean" },
                { link: "compose", text: "compose" },
                { link: "concat", text: "concat" },
                { link: "diff", text: "diff" },
                { link: "equals", text: "equals" },
                { link: "insert", text: "insert" },
                { link: "invert", text: "invert" },
                { link: "length", text: "length" },
                { link: "push", text: "push" },
                { link: "remove", text: "remove" },
                { link: "retain", text: "retain" },
                { link: "slice", text: "slice" },
                { link: "transform", text: "transform" },
            ] },
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/MichaelOstermann/delta" },
        ],
    },
    vite: {
        plugins: [
            groupIconVitePlugin(),
        ],
    },
})
