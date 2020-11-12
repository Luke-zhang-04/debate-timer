module.exports = {
    presets: [
        ["minify", {
            builtIns: false,
            evaluate: true,
            mangle: true,
        }]
    ],
    comments: false,
}
