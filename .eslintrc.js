module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "standard",
    "parser": "babel-eslint",
    "plugins": [
        "standard",
        "promise"
    ],
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "no-unused-vars": [
          "error", {
            "varsIgnorePattern": "_\w*",
            "argsIgnorePattern": "_\w*",
          }
        ],
        "comma-dangle": ["error", {
            "arrays": "never",
            "objects": "ignore",
            "imports": "never",
            "exports": "never",
            "functions": "never"
        }],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single",
            { "allowTemplateLiterals": true }
        ],
        "semi": [
            "error",
            "never"
        ]
    }
}
