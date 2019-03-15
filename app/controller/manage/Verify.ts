'use strict';
/**
 * @description 管理端登录获取图片controller
 */
import BaseController from '../BaseController';

const CaptchaInfo = {
  type: 'number?',
  phone: 'string?',
};

export default class VerifyController extends BaseController {

  public async getCaptcha() {
    const { ctx } = this;
    const { type, phone } = ctx.query;

    try {
      ctx.validate(CaptchaInfo);
      const result = await ctx.service.manage.verify.getCaptcha({ type, phone });
      if (result && result.code) return this.error({ code: result.code });
      this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：获取验证码失败 VerifyController.getCaptcha.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
