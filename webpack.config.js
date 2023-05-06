 const path = require('path');
 
 module.exports = {
  entry: path.resolve(__dirname, './src/app.jsx'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
        loader: "url-loader",
        options: { limit: false },
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'ld53.js',
  },
  devServer: {
    // static: path.resolve(__dirname, './dist'),
    compress: true,
    allowedHosts: "all",
  },
  devtool: 'source-map',
};
