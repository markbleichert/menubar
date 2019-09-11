/* eslint-disable */

const path = require('path');
const glob = require('glob');
const exec = require('child_process').exec;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'

function parsePath(sourcePath) {
    return [...[__dirname], ...sourcePath.split('/')];
}

let {
    NODE_ENV = 'development',
    OUTPUT_LIB = 'gs',
    ENTRY_KEY = 'menubar.min',
    ENTRY_PATH = 'src/index.js',
    OUTPUT_PATH = '.tmp/dist',
    SERVER_PATH = 'demo-app',
    SERVER_PORT = 8089,
    MODE
} = process.env;

// Output extracted CSS to a file
const plugin = new MiniCssExtractPlugin({
    filename: '[name].css',
});

const plugins = [plugin];

if (ENTRY_PATH.indexOf('*.') > -1) {
    ENTRY_PATH = glob.sync(ENTRY_PATH, {
        cwd: __dirname,
        root: __dirname,
        absolute: true
    });
} else {
    ENTRY_PATH = path.resolve(...parsePath(ENTRY_PATH))
}

const entry = {
    [ENTRY_KEY]: ENTRY_PATH
};


module.exports = {
    entry,
    mode: NODE_ENV,
    output: {
        path: path.resolve(__dirname, OUTPUT_PATH),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].js',
        library: OUTPUT_LIB,
        libraryTarget: 'window'
    },
    plugins,
    devtool: 'source-map',
    module: {
        rules: [
            // {
            //     enforce: 'pre',
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            //     options: {
            //         fix: true
            //     }
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader', options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                    }
                ]
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: {loader: 'html-loader'}
            }
        ]
    },
    devServer: {
        contentBase: [
            path.resolve(__dirname, SERVER_PATH),
            path.resolve(__dirname, SERVER_PATH + 'style')
        ],
        port: SERVER_PORT,
        publicPath: '/',
        watchContentBase: true,
        watchOptions: {
            poll: 1000
        },
        hot: true,
        open: true,
    }
};
console.warn('! --> ', __dirname);
