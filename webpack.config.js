const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = async (env, options) => {
    let domain = "https://localhost:3000";
    if (options.mode === 'production') {
        domain = "https://clarkpanagakos.sharepoint.com/taskpane";
    }
    return [
        {
            mode: 'development',
            entry: {
                taskpane: ["./assets/taskpane.html", "./src/index.ts"]
            },
            devtool: 'source-map',
            plugins: [
                new htmlWebpackPlugin({
                    filename: 'taskpane.html',
                    template: './assets/taskpane.html'
                }),
                new copyWebpackPlugin({
                    patterns: [
                        {
                            from: "assets/*",
                            to: "assets/[name][ext][query]"
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
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        use: 'ts-loader',
                        exclude: /node_modules/
                    },
                    {
                        test: /\.html$/,
                        use: 'html-loader',
                        exclude: /node_modules/
                    },
                    {
                        test: /\.(png|ico)$/,
                        type: "asset/resource",
                        generator: {
                            filename: "assets/images/[name][ext][query]"
                        }
                    },
                    {
                        test: /\.ttf$/,
                        type: "asset/resource",
                        generator: {
                            filename: "assets/fonts/[name][ext][query]"
                        }
                    }
                ]
            },
            resolve: {
                extensions: ['.ts', '.html']
            },
            output: {
                filename: 'taskpane.js',
                path: path.resolve(__dirname, 'dist'),
                clean: true
            }

            }
        

    ]
    
};