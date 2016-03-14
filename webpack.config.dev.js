var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: {
		index: [
			'webpack-hot-middleware/client',
			'./src/js/index'
		]
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'js/[name].js',
		chunkFilename: 'js/[id].[name].js',
		publicPath: '/static/',
		pathinfo: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			DEBUG: true
		}),
		new ExtractTextPlugin('css/[name].css')
	],
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				loaders: ['babel'],
				include: path.join(__dirname, 'src/js'),
				exclude: path.join(__dirname, 'src/js/plugins')
			}, {
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css'),
				include: path.join(__dirname, 'src/css')
			}, {
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]!postcss!sass'),
				include: path.join(__dirname, 'src/css')
			}, {
				test: /\.png|jpe?g|gif$/,
				loader: 'url-loader?limit=2000&name=img/[hash].[ext]',
				include: path.join(__dirname, 'src/img')
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		alias: {
			css: path.join(__dirname, 'src/css'),
			js: path.join(__dirname, 'src/js')
		}
	},
	postcss: function() {
		return [
			require('postcss-original-path'),
			require('postcss-assets')({
				loadPaths: ['./src/img/'],
				relative: true
			}),
			require('autoprefixer')({
				browsers: ['> 1%', 'last 2 version', 'Android >= 4.0']
			})
		];
	}
};
