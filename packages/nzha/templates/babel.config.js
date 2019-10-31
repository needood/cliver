const resolvePath = require('./resolvePath')
module.exports = {
    "env": {
        "browser": {
            "presets": [
                "@babel/preset-typescript",
                [
                    "@babel/preset-env",
                    {
                        "targets": {
                            "browsers": [
                                "last 2 iOS major versions",
                                "last 2 Android major versions"
                            ],
                            "ios": "8.2",
                        },
                        "corejs": 3,
                        "include": ["transform-block-scoping", "es.object.from-entries"],
                        "useBuiltIns": "usage",
                        "debug": true
                    }
                ]
            ],
            "plugins": [
                ["@babel/plugin-proposal-decorators", { "legacy": true}],
                ["@babel/plugin-proposal-class-properties", { "loose": true }],
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-transform-runtime",
                "@babel/plugin-transform-computed-properties",
                ["module-resolver", {
                    resolvePath: resolvePath('browser', 'browser')
                }]
            ]

        },
        "lib": {
            "presets": [
                "@babel/preset-typescript",
                ["@babel/preset-env", {
                    "targets": {
                        "node": "6.10"
                    },
                    "corejs": 3,
                    "include": ["transform-block-scoping", "es.object.from-entries"],
                    "useBuiltIns": "usage",
                    "debug": true
                }]
            ],
            "plugins": [
                ["@babel/plugin-proposal-decorators", { "legacy": true}],
                ["@babel/plugin-proposal-class-properties", { "loose": true }],
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-transform-runtime",
                "@babel/plugin-transform-computed-properties",
                ["module-resolver", {
                    resolvePath: resolvePath('lib')
                }]
            ]
        }
    }
}