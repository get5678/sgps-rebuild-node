'use strict';
/**
 * @description 小程序 登陆/注册
 */
import BaseController from '../BaseController';

export default class UserController extends BaseController {
  public async userLogin() {
    const { ctx, logger } = this;
    // const sessionId = ctx.get('sessionId');
    let result: any;

    const { code, encryptedData, iv, nickName, gender, avatarUrl, sessionId } = ctx.request.body;

    try {
      result = await ctx.service.user.login.userLogin({
        code,
        encryptedData,
        iv,
        sessionId,
        nickName,
        gender,
        avatarUrl,
      });
      // console.log('2e1e12e12e12e12', code);
      if (result.code) {
        this.error({
          code: result.code,
          msg: result.errorMsg,
        });
      } else {
        this.success(result);
      }
    } catch (error) {
      logger.error(`======${sessionId}, ${nickName}userLoginError`, error);
      console.log(error);
    }
  }
}
