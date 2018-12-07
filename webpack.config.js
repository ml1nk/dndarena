const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const prod = process.env.NODE_ENV === "production";

// the path(s) that should be cleaned
let pathsToClean = [
  "dist/*.*"
];

// the clean options to use
let cleanOptions = {
  root: __dirname,
  exclude: ['.gitignore'],
  verbose: true,
  dry: false
}

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
    rules: [{
        test: /\.css$/,
        use: [{
          loader: 'style-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          }
        }]
      },
      {
        test: /\.(png|eot|woff|woff2|ttf|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {}
        }]
      },
      {
        test: /\.(html)$/,
        use: ['html-loader']
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
    }),
    new CleanWebpackPlugin(pathsToClean, cleanOptions)
  ]
};

if (prod) {

  module.exports.module.rules[0].use[0] = {
    loader: MiniCssExtractPlugin.loader,
    options: {}
  }

  module.exports.module.rules[0].use[1].options.importLoaders = 1;

  module.exports.module.rules[0].use.push({
    loader: 'postcss-loader',
    options: { sourceMap: true }
  });

  module.exports.plugins.push(new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
    publicPath: "dist/",
    chunkFilename: "[id].[name].[hash].css"
  }));

  module.exports.plugins.push(new BundleAnalyzerPlugin({
    openAnalyzer: false,
    analyzerMode: "static"
  }));
}