'use strict';
/**
 * @description 小程序 手机号
 */
import BaseController from '../BaseController';

const validateRule = {
  userId: 'string',
};

interface PhoneInfo {
  code?: number;
  userInfo?: object;
  isBindPhone?: boolean;
}

export default class PhoneController extends BaseController {
  /**
   * @des 从数据库获取手机号
   */
  public async get() {
    const { ctx, logger } = this;
    const { userId } = ctx.query;
    try {
      // 参数验证
      ctx.validate(validateRule, ctx.query);

      const { code, userInfo, isBindPhone }: PhoneInfo = await ctx.service.user.phone.get(userId);
      if (code) {
        this.error({
          code,
        });
      } else {
        this.success({
          userInfo,
          isBindPhone,
        });
      }
    } catch (error) {
      logger.error(`====== 小程序 ${userId} getUserPhone 获取用户手机号`, error);

      this.error({
        code: error.code === 'invalid_param' ?
          4000 : null,
      });
    }
  }
  /**
   * @desc 从微信官方获取手机号
   */
  public async put() {
    const { ctx, logger } = this;
    const { userId, sessionId, iv, encryptedData } = ctx.request.body;
    const validateRule = {
      userId: 'int',
      sessionId: 'string',
      iv: 'string',
      encryptedData: 'string',
    };

    try {
      // 参数验证
      ctx.validate(validateRule);
      const { userPhoneInfo, code } = await ctx.service.user.phone.put({ userId, sessionId, iv, encryptedData });
      if (code) {
        this.error({
          code,
        });
      } else {
        this.success({
          userPhoneInfo,
        });
      }
    } catch (error) {
      logger.error(`====== 小程序 ${userId} putUserPhone 修改用户手机号`, error);
      this.error({
        code: error.code === 'invalid_param' ?
          4000 : null,
      });
    }
  }
}
