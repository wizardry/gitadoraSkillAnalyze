var path = require('path');
module.exports = {
  entry: {
      app :'./src/js/app.js'
  },
  output: {
      path:path.join(__dirname,'public'),
      filename: '[name].dist.js'
  },
  // resolve: {
  //     root:[path.join(__dirname,'public')],
  //     extensions:['[name].js']
  // },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'babel-loader' ,
        exclude: '/node_modules/',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};