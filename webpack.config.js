const Path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/scroll-sniffer.js",
  output: {
    path: Path.join(__dirname, "./dist"),
    filename: "js/scroll-sniffer.min.js",
    library: "ScrollSniffer",
    libraryTarget: "umd",
    libraryExport: "default",
    umdNamedDefine: true,
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
