const path = require('path');
const autoprefixer = require('autoprefixer');

const BUILD_DIR = path.resolve(__dirname, './dist');
const APP_DIR = path.resolve(__dirname, './src');
const IS_PROD = process.env.NODE_ENV === 'production';

function config(override) {
  return {
    mode: 'production',
    devtool: IS_PROD ? false : 'eval',
    resolve: {
      fallback: {
        path: false,
        stream: require.resolve('stream-browserify'),
      },
      modules: [path.resolve(__dirname, './src'), 'node_modules'],
      extensions: ['.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: path.resolve(__dirname, './src'),
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
        {
          test: /\.(css|scss)$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'not ie < 9',
                    ],
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.png$/,
          loader: 'url-loader',
          options: {
            limit: 10000, // if file <=10kb
          },
        },
        {
          test: /example_files\/[^\/]+$/,
          loader: 'file-loader'
        }
      ],
    },
    ...override,
  };
}

module.exports = [
  config({
    entry: `${APP_DIR}/app.js`,
    output: {
      path: BUILD_DIR,
      filename: 'index.js',
      publicPath: '/dist/',
      chunkFilename: '[id].chunk.js'
    },
  }),
  config({
    entry: require.resolve('pdfjs-dist/build/pdf.worker.entry.js'),
    output: {
      path: BUILD_DIR,
      publicPath: '/dist/',
      filename: 'index.worker.js',
      chunkFilename: '[id].chunk.js',
    },
  })
];
