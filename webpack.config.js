var path = require('path');
var buildPath = path.resolve(__dirname,"dist");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
    entry: {
        index:'./src/js/index.js'
    },
    output: {
        path:buildPath,
        filename:"bundle.js"
    },
    module: {
        rules:[
            {
                test:/\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            },
            {
              test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'img/[name].[hash:7].[ext]'
              }
            },
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'fonts/[name].[hash:7].[ext]'
              }
            },
            {
                test: /\.js$/,
                exclude:/(node_modules|bower_components)/,
                loader:'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src')
      }
    },
    plugins: [
        new ExtractTextPlugin("style.css"),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'index.html',
          inject: true
        }),
        new CopyWebpackPlugin([{
          from: resolve('config'),
          to: resolve('dist'),
          toType: 'dir'
        }])
    ]
}
