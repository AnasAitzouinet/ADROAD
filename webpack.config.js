const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  mode: "production",
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      fs: false,
      tls: false,
      net: "empty",
      less: require.resolve("less"),
      vm: require.resolve("vm-browserify"),
      vm: false,
      https: require.resolve("https-browserify"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      process: require.resolve("process/browser"),
      url: require.resolve("url/"),
      os: require.resolve("os-browserify/browser"),
      timers: require.resolve("timers-browserify"),
      http: require.resolve("stream-http"),
      constants: require.resolve("constants-browserify"),
    },
  },
  entry: {
    server: "./server.js",
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              {
                targets: {
                  node: "current",
                },
              },
            ],
          },
        },
      },
      {
        test: /\.ejs$/,
        loader: "ejs-loader",
        options: {
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: "./views/index.ejs",
      hash: true,
    }),
  ],
  node: {
    __dirname: false,
  },
};
