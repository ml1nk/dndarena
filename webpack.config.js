const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const prod = process.env.NODE_ENV === "production";

module.exports = {
  mode: prod ? 'production' : 'development',
  entry: './frontend/index.js',
  devtool: prod ? 'source-map' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: "dist/"
  },
  module: {
    rules: [
      {
        test: /\.(png|eot|woff|woff2|ttf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: ['html-loader']
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new HtmlWebpackPlugin({
      template: 'frontend/index.html'
    })
  ]
};
