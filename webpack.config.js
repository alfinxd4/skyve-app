const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

const htmlFiles = glob.sync('./src/**/*.html'); // Find all .html in src folder

console.log('HTML Files Found:', htmlFiles); // Log found .html files

// Create an instance of HtmlWebpackPlugin for each .html file
const htmlPlugins = htmlFiles.map(
  (file) =>
    new HtmlWebpackPlugin({
      inject: 'body', // Ensure the script is loaded at the end of the body
      template: file, // File .html as template
      filename: path.relative('./src', file), // Output in dist folder with same file name
    }),
);

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'; // Determine if in production mode

  return {
    mode: isProduction ? 'production' : 'development', // Set Webpack mode
    entry: {
      app: './src/js/app.js', // Entry point for JavaScript
    },
    output: {
      path: path.resolve(__dirname, 'dist'), // Output directory
      filename: 'js/[name].bundle.js', // Output JavaScript file
      assetModuleFilename: 'assets/images/[name][ext]', // Output images to dist/assets
    },
    plugins: [
      ...htmlPlugins, // HtmlWebpackPlugin instances
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            !isProduction ? 'style-loader' : 'null-loader', 
            'css-loader', // Load CSS
            'postcss-loader', // Post-process CSS with PostCSS (includes Tailwind)
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i, // Image types
          type: 'asset/resource', // Use asset/resource for building images
        },
      ],
    },
    // Config webpack-dev-server
    devServer: {
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
    },
  };
};
