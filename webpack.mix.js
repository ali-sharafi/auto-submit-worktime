const mix = require('laravel-mix');
mix
    .js("src/background/app.ts", "dist/background.js")
    .js("src/tools/tools.ts", "dist/tools.js")
    .webpackConfig({
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        }
    });