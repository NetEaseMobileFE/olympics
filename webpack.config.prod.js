var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// Init configs
var publishConfig = global.publish || {};
var revision = publishConfig.revision ? publishConfig.revision + '/' : '';
var publicPath = publishConfig.assetPath || '/static/';
var hash = publishConfig.hash ? '.[chunkhash]' : '';


module.exports = {
	devtool: 'source-map-hidden',
	entry: {
		schedule: './src/js/schedule',
		medal: './src/js/medal',
		organisation: './src/js/organisation'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: revision + 'js/[name].js',
		chunkFilename: revision + 'js/[id].[name].js',
		publicPath: publicPath
	},
	plugins: [
		new ExtractTextPlugin(revision + 'css/[name].css'),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		})
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
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss!sass'),
				include: path.join(__dirname, 'src/css')
			}, {
				test: /\.png|jpe?g|gif$/,
				loader: 'url-loader?limit=2000&name=img/[hash].[ext]',
				include: path.join(__dirname, 'src/img')
			}, {
				test: /isIterable/,
				loader: 'imports?Symbol=>false',
				include: path.join(__dirname, 'node_modules/react-css-modules')
			}
		]
	},
	resolve: {
		alias: {
			swiper: path.join(__dirname, 'src/js/plugins/swiper.js')
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
			}),
			require('postcss-pxtorem')({
				rootValue: 100,
				propWhiteList: [],
				minPixelValue: 3
			}),
			require('postcss-border-width')
		];
	}
};
