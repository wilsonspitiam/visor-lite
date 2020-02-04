const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
	context: __dirname,
  entry: './src/bundle.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  target: 'web',
  node: {
    child_process: 'empty',
    tls: 'empty',
    net: 'empty',
    fs: 'empty',
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
    new MiniCssExtractPlugin(),
    new CopyPlugin([
      { from: 'src/data', to: 'data' }
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: './images'
            }
        }]
      },
    ],
  }
};