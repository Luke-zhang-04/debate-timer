module.exports = {
    presets: [
        ["minify", {
            builtIns: false,
            evaluate: true,
            mangle: true,
        }]
    ],
    shouldPrintComment: (comment) => /@license/.test(comment),
}
