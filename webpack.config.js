const path = require('path'); //path location
const HtmlWebpackPlugin = require('html-webpack-plugin'); // htmlWebpackPlugin
const glob = require('glob'); // glob
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // miniCssxtractPlugin

const htmlFiles = glob.sync('./src/**/*.html'); // search and match .html files

// log list of .html files
console.log('HTML Files Found:', htmlFiles);

const htmlPlugins = htmlFiles.map( // automatically generate .html file
  (file) =>
    new HtmlWebpackPlugin({
      inject: 'body',
      template: file,
      filename: path.relative('./src', file),
    }),
);

module.exports = (env, argv) => {

  const isProduction = argv.mode === 'production';  // define production mode var

  return {
    mode: isProduction ? 'production' : 'development', // check mode builder
    entry: {
      app: './src/js/app.js', // entry point [output]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),  // set folder output [dist]
      filename: 'js/[name].bundle.js',  // set file .js output
    },
    plugins: [
      ...htmlPlugins, // call htmlPlugins var
      new MiniCssExtractPlugin({
        filename: 'css/[name].css', // set .css.map output [f debug]
      }),
    ],
    optimization: { // config when prod mode
      minimize: isProduction, // minim,ize code
      usedExports: true,
    },
    module: {
      rules: [
        { // [style-loader , css loader , postcss-loader](dev), ,miniCssExtractPlugin (prod)
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        { // file loader f img
          test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,  // allowed extensions
          type: 'asset/resource',
          generator: {   // generate according to what is in src/assets/
            filename: (pathData) => {
              return pathData.filename.replace('src/', '');  // delete 'src/' dan return subfolder structure
            },
        },
      },
      { // file loader f font
        test: /\.(woff|woff2|ttf|otf|eot)$/i,  // allowed extensions
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',  // generate according to what is in src/assets/
        },
      },
      ],
    },
    // return source maps f debugging whene prod mode
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};
