const path = require("path")

module.exports = {
  entry: {
    error: "./js/error-main.js",
    portfolio: "./js/portfolio-main.js",
    "map-builder": "./js/map-builder-main.js"
  },
  output: {
    path: path.resolve(__dirname, "src", "js"),
    filename: "[name].bundle.js",
    publicPath: "/js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  devServer: {
    port: 3000,
    hot: true,
    static: {
      directory: "./src",
    }
  }
}
