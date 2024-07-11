module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        `plugin:@typescript-eslint/stylistic`,
        "plugin:react-hooks/recommended",
        "plugin:react/jsx-runtime",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    parserOptions: {"project": ["./tsconfig.json", './tsconfig.node.json']},
    plugins: ["react-refresh"],
    rules: {
        "react-refresh/only-export-components": [
            "warn",
            {allowConstantExport: true},
        ],
    },
};