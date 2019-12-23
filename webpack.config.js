const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const prod = process.env.NODE_ENV === "production";

module.exports = {
  mode: prod ? 'production' : 'development',
  entry: './frontend/index.js',
  devtool: prod ? 'source-map' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.[hash].js',
    publicPath: "dist/"
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          }
        }]
      },
      {
        test: /\.(png|eot|woff|woff2|ttf|svg)$/,
        use: ['file-loader']
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
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns : [
        "dist/*.*"
      ]})
  ]
};

if (prod) {

  module.exports.module.rules[0].use[0] = {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath : ""
    }
  }

  module.exports.module.rules[0].use[1].options.importLoaders = 1;

  module.exports.module.rules[0].use.push({
    loader: 'postcss-loader',
    options: { sourceMap: true }
  });

  module.exports.plugins.push(new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
    chunkFilename: "[id].[name].[hash].css",
  }));

  module.exports.plugins.push(new BundleAnalyzerPlugin({
    openAnalyzer: false,
    analyzerMode: "static"
  }));
}