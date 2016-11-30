var path = require('path');
module.exports = {
  entry: {
      app :'./src/js/app.js'
  },
  output: {
      path:path.join(__dirname,'./build/js'),
      filename: '[name].dist.js'
  },
  resolve: {
    extensions:['','.js','jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        // test: './src/js/**/*.js',
        loader: 'babel-loader' ,
        exclude: '/node_modules/',
        query: {
          compact:false,
          presets: ['react','es2015'],
          plugins:['transform-react-jsx']
        }
      }
    ]
  },
  devtool: 'source-map',
};