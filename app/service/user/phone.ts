'use strict';

/**
 * @description user phone server
 */

import { Service } from 'egg';
import WXBizDataCrypt from '../../utils/WXBizDataCrypt';

export default class PhoneService extends Service {
  /**
   * @desc 从数据库获取手机号
   */
  public async get(userId: string): Promise<object> {
    const { app, logger } = this;
    let result: any;

    try {
      const [ { user_phone: userPhone, user_name: userName } ] = await app.mysql.select('user', {
        where: {
          user_id: userId,
        },
        columns: [ 'user_phone', 'user_name' ],
      });
      // 是否有这个人
      if (userName) {
        result = {
          isBindPhone: !!userPhone,
          userInfo: {
            userPhone,
            userName,
            userId,
          },
        };
      } else {
        result = {
          code: 2003,
        };
      }
    } catch (error) {
      logger.error(`====== 小程序 ${userId} getUserPhone 获取手机号`, error);
      result = {
        code: 1000,
      };
      throw error;
    }

    return result;
  }

  /**
   * @desc 从微信解密获取手机号
   */
  async put({ userId, iv, encryptedData, sessionId }) {
    const { app: { mysql, redis }, logger, config } = this;
    const { appId } = config.WeChat;
    let result: any;

    try {
      const userInfo = await redis.get(sessionId);
      const { session_key } = JSON.parse(userInfo);
      const data = new WXBizDataCrypt(appId, session_key);
      const userPhoneInfo = data.decryptData(encryptedData, iv);
      const { phoneNumber } = userPhoneInfo;
      const { affectedRows } = await mysql.update('user', {
        user_phone: phoneNumber,
      }, {
        where: {
          user_id: userId,
        },
      });
      // 当更新成功
      if (affectedRows === 1) {
        result = {
          userPhoneInfo,
        };
      } else {
        result = {
          code: 6000,
        };
      }
    } catch (error) {
      logger.error(`====== 小程序 ${userId} putUserPhone 修改手机号`, error);
      result = {
        code: 1000,
      };
      throw error;
    }
    return result;
  }
}
