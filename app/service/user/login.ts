'use strict';

/**
 * @description user login server
 */

import { Service } from 'egg';
import WXBizDataCrypt from '../../utils/WXBizDataCrypt';
import * as rp from 'request-promise';
import * as uuidV1 from 'uuidV1';

export default class UserService extends Service {
  /**
   * @desc code换取 session_key
   * 这是一个HTTPS接口，开发者服务器使用登录凭证 code 获取 session_key 和 openId 。
   * session_key 是对用户数据进行加密签名的密钥。为了自身应用安全，session_key 不应该在网络上传输。
   * 小程序登录文档：https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxloginobject
   * @param { Object } param 传入的参数
   * @return { Object } 对象
   */
  public async userLogin(param: UserInfo): Promise<object> {
    const { config, logger, app: { mysql, redis } } = this;
    const { appId } = config.WeChat;
    let { code, sessionId, encryptedData, iv, nickName, avatarUrl, gender }: any = param;
    let result: any;
    let openId: any;

    try {
      const userInfo: any = await this.getSessionId({
        code,
        sessionId,
      });
      const { session_key }: any = userInfo;
      let { user_id, user_rider_id }: any = userInfo;
      openId = userInfo.openId;
      sessionId = userInfo.sessionId;

      // 用户在后台登陆失效
      if (sessionId === '-1') {
        result = {
          code: 2007,
        };
        return result;
      }
      // console.log('asdsad111112121212121', user_id);

      // 新用户
      if (user_id === '-1') {
        if (encryptedData) {
          const newInfo = new WXBizDataCrypt(appId, session_key);
          // 只有关注了公众号的账户才能获取到unionID
          userInfo.union_id = newInfo.decryptData(encryptedData, iv).unionId;
        }
        // nickName = Unicode.stringify(nickName);
        const insertData = {
          user_name: nickName,
          user_avatarUrl: avatarUrl,
          user_open_id: openId,
          user_union_id: userInfo.union_id ? userInfo.union_id : '',
          user_sex: gender,
          user_create_time: mysql.literals.now,
          user_update_time: mysql.literals.now,
        };
        const { insertId } = await mysql.insert('user', insertData);
        logger.info('====== 新用户登陆呦呦', `openId：${openId}`);
        user_id = insertId;
        userInfo.user_id = insertId;
        userInfo.user_name = nickName;
      } else {
        const options = {
          where: {
            user_id,
          },
        };
        await mysql.update('user', {
          user_id,
          user_name: nickName,
          user_avatarUrl: avatarUrl,
          user_update_time: mysql.literals.now,
        }, options);
      }
      // 把用户信息存到 redis 里面
      await redis.set(sessionId, JSON.stringify(userInfo), 'EX', 24 * 60 * 60);
      logger.info(`====== 微信用户登陆成功 ${JSON.stringify(userInfo)}`);
      result = {
        ...result,
        sessionId,
        userId: user_id,
        riderId: user_rider_id,
      };
    } catch (error) {
      result = {
        ...result,
        code: '-1',
        errorMsg: '微信用户登陆失败',
      };
      logger.error(`====== 微信用户登陆失败 ${openId}, ${sessionId} userLoginError`, error);
    }

    return result;
  }

  /**
   * @desc 判断sessionId是否过期
   * 如果小程序checkSession也过期，就直接返回重新获取code
   * @param { String }sessionId sessionId
   * @param { String } code 获取 session 的 code,如果checkSession过期，则需要通过 code 获取 sessionId
   * @return { Object } { sessionId, session_key, openId, user_name, userId, riderId }
   */
  public async getSessionId({ sessionId, code }): Promise<object> {
    const { logger, app: { mysql, redis } } = this;
    let result = { sessionId };

    try {
      if (code) {
        const { session_key, openId, sessionId }: any = await this.getSessionIdByCode(code);
        // console.log('asdasdaasdasdsadasaaaa✅', session_key, openId, sessionId);
        // 通过 openId 找到用户信息
        const user = await mysql.get('user',
          { user_open_id: openId },
          { columns: [ 'user_id', 'user_union_id', 'user_name', 'user_rider_id' ] },
        );
        const userInfo = {
          session_key,
          openId,
          sessionId,
          user_name: user ? user.user_name : '',
          union_id: user ? user.union_id : '',
          user_id: user ? user.user_id : '-1',
          user_rider_id: user ? user.user_rider_id : '0',
        };
        result = userInfo;
      } else {
        // 判断sessionId是否过期
        const data = await redis.get(sessionId);
        // 过期
        if (!data) {
          result.sessionId = '-1';
        } else {
          result = JSON.parse(data);
        }
      }
    } catch (error) {
      logger.error(`======${sessionId} getSessionIdError`, error);
    }

    return result;
  }

  /**
   * @desc 通过 code 来换取 session
   * @param { String } code code值
   * @return { Object } { sessionId, session_key, openId, errorMsg }
   */
  async getSessionIdByCode(code: string): Promise<object> {
    const { config, logger } = this;
    const { appId, appSecretForLogin: appSecret } = config.WeChat;
    let result: any = {};
    // console.log('@@@@@@@@@@@@@@@@✅', appId, appSecret, code);

    try {
      // 微信接口
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
      const options = {
        method: 'GET',
        url,
        timeout: 2000, // 对外网的阻塞请求超时时间设置为2秒
      };
      const weChatResult = await rp(options).then((res: string) => JSON.parse(res));
      // console.log('++++++++___________✅', weChatResult);
      const { session_key, openid: openId, errcode: errCode } = weChatResult;

      if (errCode) {
        result.errorMsg = errCode;
        logger.error('jsCodeSessionError', weChatResult);
      } else {
        // 生成 3rd_session
        const sessionId = uuidV1();
        result = {
          sessionId,
          session_key,
          openId,
        };
        // console.log('asdsadsadasdasdasasdasdasdas✅', result);
        logger.info(`======${openId} 获取Session成功${session_key}-${sessionId}`);
      }
    } catch (error) {
      result.errorMsg = error;
      logger.error('userLoginError', error);
    }
    return result;
  }
}

export interface UserInfo {
  avatarUrl: string;
  code: string;
  encryptedData: number;
  gender: number;
  iv: string;
  nickName: string;
  sessionId?: string;
}
