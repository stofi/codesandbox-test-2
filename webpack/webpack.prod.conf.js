const path = require("path");
const merge = require("webpack-merge");
const base = require("./webpack.base.conf");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = merge(base, {
  output: {
    publicPath: "/dev-to-b/"
  },
  module: {
    rules: []
  },
  mode: "production",
  plugins: []
});
