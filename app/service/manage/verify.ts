'use strict';

/**
 * @description 管理端登录获取图片验证码
 */
import { Service } from 'egg';
import * as svgCaptcha from 'svg-captcha';
import { Code } from './admin';

export default class VerifyService extends Service {
  public async getCaptcha(data: Data): Promise<Code> {
    const { ctx } = this;

    try {
      const captcha = svgCaptcha.create();
      if (Number(data.type) === 0) {
        ctx.session['login' + data.phone] = captcha.text;
      } else if (Number(data.type) === 1) {
        ctx.session['registe' + data.phone] = captcha.text;
      } else return { code: 4000 };
      ctx.session.maxAge = 1000 * 60 * 10;
      console.log('data\n\n\n\n', captcha.data);
      return { data: captcha.data };
    } catch (err) {
      ctx.logger.error(`========管理端：获取验证码失败 VerifyServer.getCaptcha.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}

interface Data {
  phone: 'string';
  type: 'number'; // 0为登录 1为注册
}
