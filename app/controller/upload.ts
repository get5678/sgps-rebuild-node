'use strict';
/**
 * @description upload controller
 */

import BaseController from './BaseController';
import * as COS from 'cos-nodejs-sdk-v5';
// import * as fs from 'fs';

export default class UploadController extends BaseController {

  public async upload() {
    const { ctx } = this;

    try {
      const stream = await ctx.getFileStream();
      const cos = new COS({
        SecretId: 'AKIDqCVUNKH01iHjgrqhKwOm5qTiKZj1s8xn',
        SecretKey: 'tTFzqhWEWt8C8tYBjdOBrpjSBqU8GH8Q',
      });
      // cos.putObject({
      //   Bucket : 'image-1255939184',
      //   Region : 'ap-chongqing',
      //   Key : stream.filename,
      //   Body: stream,
      // }, (err: any, data: any) => {
      //   if (err) {
      //     ctx.res.end(JSON.stringify({
      //       code: data.statusCode,
      //       msg: '上传失败',
      //     }));
      //   } else {
      //     ctx.res.end(JSON.stringify({
      //       code: 1,
      //       msg: '上传成功',
      //       data: data.Location,
      //     }));
      //   }
      // });
      const put = new Promise((resolve, reject) => {
        cos.putObject({
          Bucket : 'image-1255939184',
          Region : 'ap-chongqing',
          Key : stream.filename,
          Body: stream,
        }, (err, data) => {
          if (data) {
            resolve(data.Location);
          } else {
            reject(err);
          }
        });
      });
      await put.then(value => {
        return this.success(value);
      }).catch(e => {
        console.log('err', e);
        return this.error({ code: -1 });
      });
    } catch (err) {
      ctx.logger.error(`======== 上传图片发生错误 UploadController.upload.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
