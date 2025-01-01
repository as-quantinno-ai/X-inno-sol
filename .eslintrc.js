module.exports = {
    extends: ["eslint:recommended"],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: "module"
    },
    rules: {
        indent: ["error", 4],
        quotes: ["error", "double"],
        semi: ["error", "always"]
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};
