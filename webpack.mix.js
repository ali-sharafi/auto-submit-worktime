const mix = require('laravel-mix');
const Dotenv = require('dotenv-webpack');

mix
    .js("src/serviceWorker.js", "dist/js/main.js")
    .js("src/assets/js/asw.js", "dist/js/asw.js")
    .js("src/assets/js/popup/main.js", "dist/popup.js")
    .sass('src/assets/scss/popup.scss', 'dist/popup.css')
    .webpackConfig({
        resolve: {
            extensions: ['.js', '.json', '.vue']
        },
        plugins: [
            new Dotenv()
        ],
        module: {
            rules: [
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