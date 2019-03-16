import * as crypto from 'crypto';

export default function WXBizDataCrypt(this: any, appId: any, sessionKey: any) {
  this.appId = appId;
  this.sessionKey = sessionKey;
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  const sessionKey = Buffer.from(this.sessionKey, 'base64');
  encryptedData = Buffer.from(encryptedData, 'base64');
  iv = Buffer.from(iv, 'base64');

  // console.log('@@@@@!2321312321', sessionKey, encryptedData, iv);

  let decoded: any;
  try {
     // 解密
    console.log('解密1', sessionKey, iv);
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
    console.log('解密2', decipher);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    console.log('解密3');
    decoded = decipher.update(encryptedData, '', 'utf8');
    console.log('解密4');
    decoded += decipher.final('utf8');
    console.log('解密5', decoded);
    decoded = JSON.parse(decoded);

  } catch (err) {
    console.log(err);
    throw new Error('Illegal Buffer one');
  }

  if (decoded.watermark.appid !== this.appId) {
    throw new Error('Illegal Buffer two');
  }

  return decoded;
};
