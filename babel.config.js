/* eslint-disable import/no-extraneous-dependencies */
const env = require('@babel/preset-env');
const preset = require('@babel/preset-react');

module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      env,
      preset,
    ],
  };
};