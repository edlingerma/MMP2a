const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [ 
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          "css-loader",
          "sass-loader"
        ],
      },
      { 
        test:  /\.(hbs|handlebars)$/, 
        loader: "handlebars-loader",
        options: {
            partialDirs: [path.join(__dirname, './src/components')],
            inlineRequires: './images',
            helperDirs: path.join(__dirname, './src/js/helper'),
            precompileOptions: {
              knownHelpersOnly: false,
            },
        }, 
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: { 
          loader: 'file-loader',
          options: {
              name: "../images/[hash].[ext]",
              outputPath: 'images/'
            }
          },
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'BarMap',
      inject: true,
      template: './src/pages/layout.hbs',
      minify: {
        html5: true,
        collapseWhitespace: true,
        caseSensitive: true,
        removeComments: true,
        removeEmptyElements: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
  ],
};