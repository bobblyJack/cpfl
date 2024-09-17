import {Configuration} from 'webpack';
import * as path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';

export default async function config(env: any, argv: any): Promise<Configuration> {
    let domain = "https://clarkpanagakos.sharepoint.com/taskpane";
    let map = "source-map";
    if (argv.mode === 'development') {
        domain = "https://localhost:3000";
        map = "eval-" + map;
    }
    return {
        entry: './src/init.ts',
        output: {
            filename: 'taskpane.js',
            path: path.resolve(__dirname, 'dist'),
            assetModuleFilename: './assets/[name][ext]',
            clean: true
        },
        module: {
            rules: [
                {
                   test: /\.ts$/i,
                   exclude: /node_modules/i,
                   use: 'ts-loader' 
                },
                {
                    test: /\.html$/i,
                    exclude: /node_modules/i,
                    use: 'html-loader'
                },
                {
                    test: /\.css$/i,
                    exclude: /node_modules/i,
                    use: [MiniCSSExtractPlugin.loader, 'css-loader']
                }
            ]
        },
        resolve: {
            extensions: [
                '.ts'
            ]
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: "styles",
                        type: "css/mini-extract",
                        chunks: "all",
                        enforce: true
                    }
                }
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'taskpane.html',
                template: './src/html/index.html'
            }),
            new MiniCSSExtractPlugin({
                filename: 'taskpane.css'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "./assets/**/*",
                        to: "./[path][name][ext]",
                    },
                    {
                        from: "manifest.xml",
                        to: "[name]" + "[ext]",
                        transform(content) {
                            return content.toString().replace(/%APPDOMAIN%/g, domain);
                        }
                    }
                ]
            }) 
        ],
        devtool: map
    }
}