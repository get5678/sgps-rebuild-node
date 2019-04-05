'use strict';
/**
 * @description order server
 */

import { Service } from 'egg';

export default class PayCallBackService extends Service {
  public async option({ orderId }) { // out_trade_no
    const { app: { mysql }, logger } = this;
    let result;
    const row = {
      order_state: '1',
    };
    const options = {
      where: {
        order_trade_code: orderId,
      },
    };
    try {
      console.log('@@@@@@@@@@@');
      result = await mysql.update('t_order', row, options);
      if (!result.errorMsg) {
        return {
          xml: `<xml>
                  <return_code>SUCCESS</return_code>
                  <return_msg>OK></return_msg>
                </xml>`,
        };
      }
    } catch (error) {
      logger.error('===============payCallBack=======', error);
    }
    return result;
  }
}
