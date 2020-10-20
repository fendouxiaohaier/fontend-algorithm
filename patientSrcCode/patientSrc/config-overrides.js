const {
  override,
  fixBabelImports,
  addPostcssPlugins,
  addDecoratorsLegacy,
  addWebpackAlias,
  addWebpackPlugin
} = require("customize-cra");
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const paths = require('react-scripts/config/paths');
paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist');//修改输出路径

const cwd = process.cwd();

const { NODE_ENV = 'production', REACT_APP_ENV } = process.env;

const dotenvPath = path.join(cwd, '.env');

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${dotenvPath}.${REACT_APP_ENV || NODE_ENV}.local`,
  `${dotenvPath}.local`,
  `${dotenvPath}.${REACT_APP_ENV || NODE_ENV}`,
  dotenvPath,
];


dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      }),
    );
  }
});


// const MED_APP = /^MED_APP_/;

function getClientEnvironment() {
  const raw = Object.keys(process.env)
    // .filter(key => MED_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV,
        MOCK: process.env.MOCK === 'enable',
      },
    );
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}
const envVar = getClientEnvironment();

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd-mobile",
    style: "css"
  }),
  addWebpackPlugin(new webpack.DefinePlugin(envVar.stringified)),
  process.env.NODE_ENV === 'production' && addWebpackPlugin(new SentryWebpackPlugin({
    release: `${process.env.HOSPITAL_TAG}${process.env.VERSION}`,
    include: './dist',
    // ignoreFile: '.sentrycliignore',
    ignore: ['node_modules'],
    configFile: 'sentry.properties',
  })),
  addDecoratorsLegacy(),
  addWebpackAlias({
    ["@"]: path.resolve(__dirname, "src")
  }),
  addPostcssPlugins([
    // require("postcss-px2rem-exclude")({ remUnit: 32, exclude: /node_modules/i })
    require("postcss-px-to-viewport")({
      viewportWidth: 750,
      viewportHeight: 1334,
      unitPrecision: 5,
      viewportUnit: "vw",
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      exclude: /node_modules/i
    })
  ]),
  (config) => {
    config.devtool = process.env.NODE_ENV === 'production' ? 'source-map' : false;
    return config;
  }
);
