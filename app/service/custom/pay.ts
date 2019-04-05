'use strict';
/**
 * @description order server
 */

import { Service } from 'egg';
import * as uuidV1 from 'uuid/v1';
import * as rp from 'request-promise';
import * as xmlreader from 'xmlreader';
import * as md5 from 'blueimp-md5';

export default class PaymentService extends Service {
  // 创建支付
  public async create(param) {
    const { app: { mysql }, logger, ctx } = this;
    const { req } = ctx;
    // 获取客户端ip
    // 下面ts会报错...
    // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.connection.socket.remoteAddress;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const { finalPrce, insertId, openId, ...orderInfo } = param;
    const pay_order_id = this.creatOrderId(); // 商户订单号
    try {
      const row = {
        order_trade_code: pay_order_id,
      };
      const options = {
        where: {
          order_code: orderInfo.order_code,
        },
      };
      await mysql.update('t_order', row, options);
      // 生成支付参数
      const payParam = await this.unifiedorder({
        out_trade_no: pay_order_id,
        databaseId: insertId,
        openId,
        finalPrce,
        ip,
      });

      // 返回给前端支付的参数
      return {
        ...payParam,
        orderPayId: insertId,
      };
    } catch (error) {
      logger.error(`====${openId}payService 生成支付流水`, error);
      return { code: 5300 };
    }
  }

  // 获得签名
  getSign(param, key) {
    const paramArr: any = [];
    let stringSignTemp = '';
    Object.keys(param).forEach(key => {
      paramArr.push({
        key,
        value: param[key],
      });
    });
    for (const item of paramArr) {
      stringSignTemp += `${item.key}=${item.value}&`;
    }
    stringSignTemp += `key=${key}`;
    //  md5
    const sign = md5(stringSignTemp).toLocaleUpperCase();
    return sign;
  }

  async unifiedorder(param) {
    let { openId, ip, finalPrce, out_trade_no, databaseId } = param;
    ip = ip.indexOf(':') === -1 ? ip : '119.23.107.103';
    const { config: { WeChat }, logger } = this;
    let result: any = {
      code: -1,
      msg: '调起微信支付错误',
    };

    try {
      const { appId, mch_id, key, notifyUrl } = WeChat;
      const nonce_str = uuidV1().substr(0, 19);
      const sign = this.getSign({
        appid: appId,
        attach: `${databaseId}`,
        body: `水果配送-${out_trade_no}`,
        mch_id,
        nonce_str,
        notify_url: notifyUrl,
        openid: openId,
        out_trade_no,
        spbill_create_ip: ip,
        total_fee: finalPrce,
        trade_type: 'JSAPI',
      }, key);

      const form = `
        <xml>
          <appid>${appId}</appid>
          <attach>${databaseId}</attach>
          <body>水果配送-${out_trade_no}</body>
          <mch_id>${mch_id}</mch_id>
          <nonce_str>${nonce_str}</nonce_str>
          <notify_url>${notifyUrl}</notify_url>
          <openid>${openId}</openid>
          <out_trade_no>${out_trade_no}</out_trade_no>
          <spbill_create_ip>${ip}</spbill_create_ip>
          <total_fee>${finalPrce}</total_fee>
          <trade_type>JSAPI</trade_type>
          <sign>${sign}</sign>
        </xml>
      `;
      const options = {
        method: 'POST',
        url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
        form,
        timeout: 3000,
      };
      const pResult = await rp(options).then(res => {
        return res;
      });

      xmlreader.read(pResult, (err, res) => {
        if (res.xml.return_code.text() === 'SUCCESS') {
          const timeStamp = Number(new Date().getTime() / 1000);
          const sign = this.getSign({
            appId: res.xml.appid.text(),
            nonceStr: res.xml.nonce_str.text(),
            package: `prepay_id=${res.xml.prepay_id.text()}`,
            signType: 'MD5',
            timeStamp: `${timeStamp}`,
          }, key);
          result = {
            timeStamp: Number(new Date().getTime() / 1000),
            nonceStr: res.xml.nonce_str.text(),
            prepay_id: res.xml.prepay_id.text(),
            signType: 'MD5',
            paySign: sign,
          };
        } else {
          logger.error(`====${openId} ${err} unifiedorder`, pResult);
        }
      });
    } catch (error) {
      logger.error(`====${openId} unifiedorder`, error);
    }
    console.log('<<<<<<<<>>>>>>>>', result);
    return result;
  }

  creatOrderId() {
    const timestamp = new Date().getTime();
    const random = Math.random().toString().substr(2, 7);
    return `${timestamp}${random}`;
  }
}
