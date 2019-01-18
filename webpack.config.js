const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const S3Plugin = require('webpack-s3-plugin');
require('dotenv').config();

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
        new CleanWebpackPlugin(PATHS.build, {
            root: path.resolve(__dirname, "..")
        }),
        new HtmlWebpackPlugin({
        inject: true,
        template: `${PATHS.public}/index.html`,
        filename: htmlFile,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        new CompressionPlugin({
            test: /\.(css)$/,
            filename: '[path].gz[query]',
            algorithm: 'gzip',
        }),
        new S3Plugin({
            s3Options: {
              accessKeyId: process.env.AWS_ACCESS_KEY, // Your AWS access key
              secretAccessKey: process.env.AWS_SECRET_KEY // Your AWS secret key
            //   region: 'eu-east-2' // The region of your S3 bucket
            },
            s3UploadOptions: {
              Bucket: 'shawntoubeau', // Your bucket name
              // Here we set the Content-Encoding header for all the gzipped files to 'gzip'
              ContentEncoding(fileName) {
                if (/\.gz/.test(fileName)) {
                  return 'gzip'
                }
              },
              // Here we set the Content-Type header for the gzipped files to their appropriate values, so the browser can interpret them properly
              ContentType(fileName) {
                if (/\.css/.test(fileName)) {
                  return 'text/css'
                }
              }
            },
            basePath: 'my-dist', // This is the name the uploaded directory will be given
            directory: './src' // This is the directory you want to upload
          })
    ]
}