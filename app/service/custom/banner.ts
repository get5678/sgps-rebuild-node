'use strict';

/**
 * @description 小程序 banner service
 */

import { Service } from 'egg';

export default class BannerServer extends Service {
  public async banner(): Promise<any> {
    const { app, ctx: { logger } } = this;
    let result: any;

    try {
      const data = await app.mysql.select('banner');
      result = data.map((item: Banner) => {
        return {
          id: item.banner_id,
          url: item.banner_url,
          des: item.banner_des,
        };
      });
    } catch (error) {
      result.code = '5000';
      result.errorMsg = '查询失败';
      logger.error(`========小程序端：查询首页轮播图失败, error: ${error}`);
    }

    return result;
  }
}

export interface Banner {
  banner_id: number;
  banner_url: string;
  banner_des: string;
}
