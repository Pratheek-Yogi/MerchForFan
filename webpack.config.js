const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isAnalyze = env && env.analyze;

  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    entry: './client/index.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: '[name].[contenthash].js',
      publicPath: '/',
      clean: true,
    },
    
    performance: {
      hints: false,
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
              plugins: ['@babel/plugin-syntax-dynamic-import'],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|webp|obj|mtl|glb)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './client/index.html',
        filename: 'index.html',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'client/components/images',
            to: 'assets',
          },
          {
            from: 'client/components/3Dobjects',
            to: 'assets',
          }
        ],
      }),
    ].concat(isProduction ? [new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
    })] : []),

    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        three: path.resolve(__dirname, 'node_modules/three'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      },
    },

    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/](three)[\\/]/,
            name: 'three',
            chunks: 'all',
            priority: 50,
            enforce: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 40,
            enforce: true,
          },
          router: {
            test: /[\\/]node_modules[\\/](react-router|react-router-dom)[\\/]/,
            name: 'router',
            chunks: 'all',
            priority: 35,
            enforce: true,
          },
          axios: {
            test: /[\\/]node_modules[\\/](axios)[\\/]/,
            name: 'axios',
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: 'single',
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

  if (isAnalyze) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};
