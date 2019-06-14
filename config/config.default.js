/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
const os = require('os');


/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1554420099092_3888';

  // add your middleware config here
  config.middleware = ['errorHandler'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: ['http://localhost:4300', 'http://127.0.0.1:4300'],
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.bcrypt = {
    saltRounds: 10,
  },

    // database config
    config.sequelize = {
      dialect: 'postgres',
      // host: '127.0.0.1',
      host: '10.1.1.123',
      port: 5432,
      database: 'smeg_development',
      username: 'deploy',
      password: 'password',
    };

  config.jwt = {
    secret: 'Great4-M',
    enable: true, // default is false
    match: '/jwt', // optional
  };

  config.multipart = {
    fileSize: '10mb',
    mode: 'file',
    whitelist: [
      '.pdf',
      '.jpg',
      '.jpeg'
    ],
    tmpdir: path.join(os.tmpdir(), 'upload-tmp', appInfo.name),
    cleanSchedule: {
      cron: '0 30 4 * * *',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
