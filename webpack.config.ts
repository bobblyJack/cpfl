import {Configuration} from 'webpack';
import * as path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import env from './src/env';

const config: Configuration = {
    entry: './src/init.ts',
    output: {
        filename: 'taskpane.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: './assets/[name][ext]',
        clean: true
    },
    module: {
        defaultRules: [
            {
                exclude: /node_modules/i
            }
        ],
        rules: [
            {
                test: /\.ts$/i,
                use: 'ts-loader' 
            },
            {
                test: /\.html$/i,
                use: 'html-loader'
            },
            {
                test: /\.css$/i,
                use: [MiniCSSExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(ico|ttf)$/i,
                type: 'asset/resource'
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
            template: './src/html/taskpane.html'
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
                    to: "./[path][name][ext]",
                    transform(content) {
                        let output = content.toString();
                        output = output.replace(/%CLIENTID%/g, env.client);
                        output = output.replace(/%APPHOST%/g, env.site.host);
                        return output;
                    }
                }
            ]
        }) 
    ],
    devtool: 'source-map'
}

export default config;