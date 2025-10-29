const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = {

  entry: './client/index.js',

  output: {

    path: path.resolve(__dirname, 'public'),

    filename: 'bundle.js',

    publicPath: '/',

  },

  module: {

    rules: [

      {

        test: /\.(js|jsx)$/,

        exclude: /node_modules/,

        use: {

          loader: 'babel-loader',

          options: {

            presets: ['@babel/preset-env', '@babel/preset-react'],

          },

        },

      },

      {

        test: /\.css$/,

        use: ['style-loader', 'css-loader'],

      },

      {

        test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,

        type: 'asset/resource',

      },

    ],

  },

  plugins: [

    new HtmlWebpackPlugin({

      template: './public/index.html',

      filename: 'index.html',

    }),

  ],

  resolve: {

    extensions: ['.js', '.jsx'],

    alias: {

      // ✅ This is the definitive fix for the multiple instances warning.

      three: path.resolve(__dirname, 'node_modules/three'),

    },

    fallback: {

      "http": require.resolve("stream-http"),

      "https": require.resolve("https-browserify"),

      "util": require.resolve("util/"),

      "zlib": require.resolve("browserify-zlib"),

      "stream": require.resolve("stream-browserify"),

      "url": require.resolve("url/"),

      "assert": require.resolve("assert/")

    }

  },

  devServer: {

    static: {

      directory: path.join(__dirname, 'public'),

    },

    compress: true,

    port: 3000,

    hot: true,

    historyApiFallback: true,

    proxy: [

      {

        context: ['/api'],

        target: 'http://localhost:5000',

        changeOrigin: true,

      },

    ],

  },

};
