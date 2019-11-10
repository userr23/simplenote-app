const path              = require( 'path' );
const webpack           = require( 'webpack' );
const autoprefixer      = require( 'autoprefixer' );
const cssnano           = require( 'cssnano' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const ExtractCssPlugin  = require( 'mini-css-extract-plugin' );

const devMode = process.env.NODE_ENV !== 'production';

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        sourceMap: devMode,
        plugins: [
            autoprefixer(),
            cssnano( { preset: 'default' } )
        ]
    }
};

module.exports = {
    entry  : {
        script: './src/index.js'
    },
    output : {
        publicPath: devMode ? '/' : '',
        path      : path.resolve( __dirname, './dest' )
    },
    module : {
        rules: [
            {
                test   : /\.js$/,
                exclude: /(node_modules)/,
                use    : {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/preset-env', '@babel/react' ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-export-default-from'
                        ]
                    }
                }
            },
            {
                test: /\.woff(2)?|ttf|eot|svg$/,
                use: [
                    {
                        loader: 'file-loader',
                        /*options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }*/
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    devMode ? 'style-loader' : ExtractCssPlugin.loader,

                    {
                        loader : 'css-loader',
                        options: { sourceMap: devMode }
                    },
                    postcssLoader
                ]
            },
            {
                test: /\.(scss)|(sass)$/,
                use: [
                    devMode
                        ? { loader: 'style-loader', options: { sourceMap: devMode } }
                        : ExtractCssPlugin.loader,

                    {
                        loader : 'css-loader',
                        options: {
                            sourceMap: devMode,
                            modules  : { localIdentName: devMode ? '[path][name]__[local]' : '[hash:base64]' }
                        }
                    },
                    postcssLoader,
                    { loader: 'sass-loader', options: { sourceMap: devMode } }
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin( { template: path.resolve( __dirname, './src/index.html' ) } ),
        new webpack.DefinePlugin( {
            NODE_ENV: JSON.stringify( process.env.NODE_ENV || 'develop' ),
        } ),

        ...( devMode ? [

            ] : [
                new ExtractCssPlugin( { filename: 'styles.css' } )
            ]
        )
    ],
    mode: devMode ? 'development' : 'production',
    devtool: devMode ? 'source-map' : false,
    devServer: {
        hot               : true,
        contentBase       : './src',
        port              : 8085,
        historyApiFallback: true
    }
};
