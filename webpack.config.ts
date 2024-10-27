import {Configuration as WebpackConfig} from 'webpack';
import {Configuration as ServerConfig} from 'webpack-dev-server';
import {getHttpsServerOptions} from 'office-addin-dev-certs';
import * as path from 'path';
import env from './env.config.json';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';

interface Configuration extends WebpackConfig {
    devServer?: ServerConfig
}

// development variables
const devBuild = process.argv.includes('development');
const devPort = 3000;
const devHost = devBuild 
    ? `localhost:${devPort}` 
    : env.host;
const devMaps = devBuild ? 'source-map' : false;
const devCerts = async () => {
    if (process.argv.includes('serve')) {
        return getHttpsServerOptions();
    }
}

export default async (): Promise<Configuration> => {
    return {
        entry: './src/index.ts',
        output: {
            filename: 'taskpane.js',
            path: path.resolve(__dirname, 'dist'),
            assetModuleFilename: './assets/[name][ext]',
            sourceMapFilename: './maps/[file].map',
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
                    test: /\.(ttf|ico)$/i,
                    type: 'asset/resource'
                }
            ]
        },
        resolve: {
            extensions: [ 
                '.ts', '...'
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
                filename: 'index.html',
                template: './taskpane.html'
            }),
            new MiniCSSExtractPlugin({
                filename: '[name].css'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "./assets/**/*",
                        to: "./[path][name][ext]"
                    },
                    {
                        from: "env.config.json",
                        to: "./config.json"
                    },
                    {
                        from: "manifest.xml",
                        transform(content) {
                            let output = content.toString();
                            output = output.replace(/%APPHOST%/g, devHost);
                            output = output.replace(/%APPID%/g, env.id);
                            return output;
                        }
                    }
                ]
            })
        ],
        devtool: devMaps,
        devServer: {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            server: {
                type: "https",
                options: await devCerts()
            },
            port: devPort
        }
    }
}