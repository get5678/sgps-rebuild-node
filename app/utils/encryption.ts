'use strict';

import * as crypto from 'crypto';

/**
 * @description 密码加密
 * @param account 账号
 * @param password 密码
 */

export default (account, password) => crypto.createHmac('sha256', password).update(account).digest('hex');
