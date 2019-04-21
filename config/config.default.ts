import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {
    WeChat: {
      appId: 'wx1596f4ad055e0f04',
      payAppId: 'wx5c9ec439378c50f2',
      appSecretForLogin: '8461088b9968bdc8463837633eb01207',
      appSecret: 'e878a9ccf695b6bd63e36e33e2f3ecf0',
      token: '99a8576443c63edd8c134096b2a79a1f',
      mch_id: '1520431241',
      key: 'youyouqinfenfeng123456youyoufeng',
      unifiedorder: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      notifyUrl: 'http://127.0.0.1:7001/api/order/payCallBack',
    },
  } as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1552123162549_5041';

  // add your egg config in here
  config.middleware = [ 'errorHandler', 'requestLogger' ];
  // cos
  config.cos = {
    client: {
      secretId: 'AKIDqCVUNKH01iHjgrqhKwOm5qTiKZj1s8xn',
      secretKey: 'tTFzqhWEWt8C8tYBjdOBrpjSBqU8GH8Q',
      bucket : 'image-1255939184',
      region : 'ap-chongqing',
    },
  };
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
  // redis
  config.redis = {
    client: {
      port: 6379,
      host: '112.74.164.230',
      password: 'Qff2018...',
      db: 0,
    },
  };
  // session
  config.session = {
    key: 'ManageSession',
    maxAge: 30 * 60 * 1000, // session 30分钟过期
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
