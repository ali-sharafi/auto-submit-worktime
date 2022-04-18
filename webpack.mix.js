const mix = require('laravel-mix');

mix
    .js("src/app.ts", "dist/js/app.js")
    .sass('src/scss/app.scss', 'dist/css/app.css')
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
    }).options({
        processCssUrls: false
    });