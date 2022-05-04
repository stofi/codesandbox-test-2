const path = require("path");
const merge = require("webpack-merge");
const base = require("./webpack.base.conf");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = merge(base, {
  mode: "development",
  module: {
    rules: []
  },
  output: {
    publicPath: ""
  },
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /[\\/](!api|!static)[\\/]/, to: "/index.html" }]
    },
    disableHostCheck: true,
    contentBase: false,
    host: "localhost",
    port: 8080
  },
  devtool: "inline-source-map"
});
