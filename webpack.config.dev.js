var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: {
		schedule: [
			'webpack-hot-middleware/client',
			'./src/js/schedule'
		],
		medal: [
			'webpack-hot-middleware/client',
			'./src/js/medal'
		],
		organisation: [
			'webpack-hot-middleware/client',
			'./src/js/organisation'
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
		// new ExtractTextPlugin('css/[name].css')
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
				loader: 'style!css',
				include: path.join(__dirname, 'src/css')
			}, {
				test: /\.scss$/,
				loader: 'style!css?modules&importLoaders=1&localIdentName=[local]___[hash:base64:2]!postcss!sass',
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
