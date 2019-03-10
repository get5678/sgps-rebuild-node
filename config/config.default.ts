import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1552123162549_5041';

  // add your egg config in here
  config.middleware = [ 'errorHandler', 'requestLogger' ];

  // 配置mysql
  config.mysql = {
    client: {
      host: '47.100.104.16',
      port: '3306',
      user: 'root',
      password: 'tpf981125',
      database: 'sgps',
    },
    app: true,
    agent: false,
  };
  // session
  config.session = {
    key: 'ManageSession',
    maxAge: 20 * 60 * 1000,
    httpOnly: true,
    encrypt: true,
    renew: true,
  };

  config.security = {
    csrf: {
      enable: false,
    },
    // 跨域白名单
    domainWhiteList: [ 'http://127.0.0.1:8000' ],
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
