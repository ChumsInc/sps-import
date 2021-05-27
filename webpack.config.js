/**
 * Created by steve on 12/2/2016.
 */
const webpack = require('webpack');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let args = process.argv;

let production = false;
if (args.indexOf('-p') > -1) {
    console.log('*** building in production mode ***');
    production = true;
}

const localProxy = {
    target: {
        host: 'localhost',
        protocol: 'http:',
        port: 8081
    },
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

const config = {
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-map' : "eval-source-map",
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'public/js'),
        filename: "[name].[contenthash].js",
        sourceMapFilename: '[file].map',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [{loader: 'style-loader'}, {loader: 'css-loader'}]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
                chums: {
                    test: /[\\/]common-components[\\/]/,
                    name: 'chums',
                    chunks: 'all',
                },
            }
        }
    },
    plugins: [
        new ManifestPlugin(),
        new BundleAnalyzerPlugin(),
    ],
    target: 'web',
};

if (!production) {
    config.plugins = [
        ...config.plugins,
        new webpack.HotModuleReplacementPlugin(),
    ];
    config.output.filename = 'bundle.js';
    config.devServer = {
        contentBase: path.join(__dirname, '/public'),
        // hot: true,
        proxy: {
            '/node': Object.assign({}, localProxy),
            '/api': Object.assign({}, localProxy),
            '/node-api': Object.assign({}, localProxy),
            '/node-dev': Object.assign({}, localProxy),
            '/intranet': Object.assign({}, localProxy),
            '/sage': Object.assign({}, localProxy),
        }
    };
    config.watchOptions = {
        ignored: ['node_modules/**', 'public/**']
    }
}
module.exports = config;
