import { Configuration } from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default (env: 'production' | 'development'): Configuration => {
  const isPro: boolean = env === 'production';
  return {
    mode: isPro ? 'production' : 'development',
    entry: {
      index: path.resolve(__dirname, './src/index.ts')
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].[hash].js',
      publicPath: isPro ? './' : '/'
    },
    cache: true,
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ['babel-loader', 'ts-loader', 'eslint-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [
            isPro ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.jpg$/,
          loader: 'url-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        chunks: ['index'],
        hash: true
      }),
      new StyleLintPlugin({
        syntax: 'scss',
        configFile: path.resolve(__dirname, './.stylelintrc.js'),
        files: '**/*.scss'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './src/image'),
            to: path.resolve(__dirname, './dist/image')
          }
        ]
      }),
      ...(isPro ? [new MiniCssExtractPlugin()] : [])
    ],
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    devServer: {
      hot: true,
      open: true,
      before: (_app, server, compiler): void => {
        compiler.hooks.done.tap('done', () => {
          if (
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            Object.keys((compiler as any).watchFileSystem.watcher.mtimes).some(
              (name) => path.parse(name).ext === '.html'
            )
          ) {
            server.sockWrite(server.sockets, 'content-changed');
          }
        });
      }
    }
  };
};
