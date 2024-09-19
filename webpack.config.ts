import {Configuration} from 'webpack';
import * as path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import env from './src/env';

const config: Configuration = {
    mode: env.mode,
    entry: {
        taskpane: './src/init.ts',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(env.dir),
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
            '.js', 
            '.json', 
            '.ts'
        ],
        fallback: {
            buffer: require.resolve('buffer'),
            crypto: require.resolve('crypto-browserify'),
            https: require.resolve('https-browserify'),
            stream: require.resolve('stream-browserify'),
            url: require.resolve('url'),
            util: require.resolve('util'),
            vm: require.resolve('vm-browserify')
        }
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
            template: './src/html/app.html'
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
                        output = output.replace(/%APPID%/g, env.clientID);
                        output = output.replace(/%APPDOMAIN%/g, env.domain);
                        return output;
                    }
                }
            ]
        }) 
    ],
    devtool: 'source-map'
}

export default config;