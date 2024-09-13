import {Configuration} from 'webpack';
import * as path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default async function config(env: any, argv: any): Promise<Configuration> {
    return {
        entry: './src/init.ts',
        output: {
            filename: 'taskpane.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true
        },
        module: {
            rules: [
                {
                   test: /\.ts$/i,
                   exclude: /node_modules/i,
                   use: 'ts-loader' 
                }
            ]
        },
        resolve: {
            extensions: [
                '.ts'
            ]
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "./**/*",
                        to: "./[path][name][ext]",
                        context: 'assets'
                    },
                    {
                        from: "manifest.xml",
                        to: "[name]" + "[ext]",
                        transform(content) {
                            let domain = "https://localhost:3000";
                            if (argv.mode === 'production') {
                                domain = "https://clarkpanagakos.sharepoint.com/taskpane";
                            }
                            return content.toString().replace(/%APPDOMAIN%/g, domain);
                        }
                    }
                ]
            }) 
        ]
    }
}