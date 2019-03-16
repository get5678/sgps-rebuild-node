'use strict';
/**
 * @description 小程序 首页轮播图片
 */
import BaseController from '../BaseController';

export default class BannerController extends BaseController {
  /**
   * @description 获取首页轮播图片
   */
  public async banner() {
    const { ctx, logger } = this;
    try {
      const result = await ctx.service.custom.banner.banner();
      if (result.code) {
        this.error({
          msg: result.errorMsg,
          code: result.code,
        });
      } else {
        this.success(result);
      }
    } catch (error) {
      logger.error(error);
    }
  }
}
