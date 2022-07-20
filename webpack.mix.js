const mix = require('laravel-mix');
const Dotenv = require('dotenv-webpack');

mix
    .js("src/app.ts", "dist/js/app.js")
    .js("src/serviceWorker.ts", "dist/js/main.js")
    .js("src/assets/js/popup/main.js", "dist/popup.js")
    .sass('src/scss/app.scss', 'dist/css/app.css')
    .sass('src/assets/scss/popup.scss', 'dist/popup.css')
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