const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const S3Plugin = require('webpack-s3-plugin');
const AWS = require('aws-sdk');
const pjson = require('./package.json');

const BUCKET = "myBucket";

// For versioning of .css files
const versionNumber = pjson.version
    .split("")
    .filter(i => i !== ".")
    .join("");

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'index_bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: `./src/index.html`,
        }),
        new S3Plugin({
            include: /.*\.(css)/, // Include only .css files
            s3Options: {
              credentials: new AWS.SharedIniFileCredentials({profile: 'default'}),
              region: 'us-east-1'
            },
            s3UploadOptions: {
              Bucket: BUCKET,
            },
            basePath: `common-css/${versionNumber}`, // This is the name the uploaded directory will be given
            directory: './src' // This is the directory you want to upload
          })
    ]
}