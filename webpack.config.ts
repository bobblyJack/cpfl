import {Configuration, DefinePlugin} from 'webpack';
import * as path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';

const devBuild = process.argv.includes('development');
const devMaps = devBuild ? 'source-map' : false;
process.env.NODE_ENV = process.env.NODE_ENV || devBuild ? 'development' : 'production';

// environment variables
const env = {
    DEV_HOST: "localhost:3000",
    PROD_HOST: "bobblyJack.github.io/cpfl",
    CLIENT_ID: "8ca8fd63-8fd6-4414-92e4-21584ed8df0f",
    TENANT_ID: "e72b34cf-ef52-473c-816a-e1d7d416dcc4",
    DRIVE_ID: "b!sZigh2uhLkm81En6bkEH0c-dYK-8B61EljQC5ygtekif7QwnUqswTLKnsBFEkAKV"
}

const config: Configuration = {
    entry: './src/index.ts',
    output: {
        filename: 'taskpane.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: './assets/[name][ext]',
        sourceMapFilename: './src/[name][ext].map',
        clean: true
    },
    module: {
        defaultRules: [
            {
                include: /src/i,
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
            template: './src/html/taskpane.html'
        }),
        new MiniCSSExtractPlugin({
            filename: 'styles.css'
        }),
        new DefinePlugin((() => {
            const definitions: [string, string][] = [
                [
                    'process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV)
                ]
            ]
            for (const [key, value] of Object.entries(env)) {
                definitions.push([
                    `process.env.${key}`, JSON.stringify(value)
                ])
            }
            return Object.fromEntries(definitions);
        })()),
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
                        output = output.replace(/%CLIENTID%/g, env.CLIENT_ID);
                        output = output.replace(/%APPHOST%/g, devBuild
                            ? env.DEV_HOST
                            : env.PROD_HOST
                        );
                        return output;
                    }
                }
            ]
        })
    ],
    devtool: devMaps
}

export default config;