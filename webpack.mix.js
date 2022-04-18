const mix = require('laravel-mix');
const Dotenv = require('dotenv-webpack');

mix
    .js("src/app.ts", "dist/js/app.js")
    .sass('src/scss/app.scss', 'dist/css/app.css')
    .webpackConfig({
        plugins: [
            new Dotenv()
        ],
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