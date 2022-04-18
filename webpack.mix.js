const mix = require('laravel-mix');
const Dotenv = require('dotenv-webpack');

mix
    .js("src/app.ts", "dist/js/app.js")
    .sass('src/scss/app.scss', 'dist/css/app.css')
    .webpackConfig({
        resolve: {
            extensions: ['.ts', '.js', '.json', '.vue']
        },
        plugins: [
            new Dotenv()
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        esModule: true
                    }
                }
            ]
        }
    }).options({
        processCssUrls: false
    }).vue();