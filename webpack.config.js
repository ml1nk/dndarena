const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackPwaManifest = require('webpack-pwa-manifest')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WorkboxPlugin = require('workbox-webpack-plugin');
const prod = process.env.NODE_ENV === "production";

module.exports = {
  mode: prod ? 'production' : 'development',
  entry: './frontend/index.js',
  devtool: prod ? 'source-map' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.[hash].js',
    publicPath: ""
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
        use: {
          loader: 'file-loader',
          options: {
              name: '[contenthash].[ext]',
              outputPath: 'assets/',
              useRelativePath: true,
          },
      }
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
      template: 'frontend/index.html',
      favicon: path.resolve('./frontend/assets/icon.ico')
    }),
    new WebpackPwaManifest({
      filename: "[name].[hash].webmanifest",
      name: 'DnD Arena',
      short_name: 'Arena',
      display: 'standalone',
      start_url: '.',
      description: 'DnD Arena für ',
      background_color: '#ffffff',
      theme_color: '#0000ff',
      crossorigin: 'use-credentials',
      icons: [
        {
          src: path.resolve('./frontend/assets/icon.png'),
          destination: "assets",
          sizes: [96, 128, 192, 256, 384, 512, 1024] // multiple sizes
        }
      ]
    }),
    new WorkboxPlugin.GenerateSW({
      exclude: [/.(?:png|eot|woff|woff2|ttf|svg)$/],
      runtimeCaching: [{
          urlPattern: /.(?:png|eot|woff|woff2|ttf|svg)$/,
          handler: "CacheFirst",
      }]
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns :[
        '**/*', 
        '!.gitignore'
      ]
    })
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