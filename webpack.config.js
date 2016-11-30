var path = require('path');
module.exports = {
  entry: {
      app :'./src/js/app.js'
  },
  output: {
      path:path.join(__dirname,'public'),
      filename: '[name].dist.js'
  },
  resolve: {
    extensions:['','.js']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'babel-loader' ,
        exclude: '/node_modules/',
        query: {
          presets: ['es2015'],
        }
      }
    ]
  },
  devtool: 'source-map',
};