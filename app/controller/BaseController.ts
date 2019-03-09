'use strict';

import { Controller } from 'egg';
import Deal from '../interface/deal';

export default class BaseController extends Controller implements Deal {
  success = (data: any) => {
    const code: number = 1;
    this.ctx.body = {
      code,
      msg: '成功',
      data,
    };
  }

  error = (param?: any) => {
    const { code } = param;
    this.ctx.body = {
      code: code ? code : -1,
      msg: '失败',
    };
  }

  notFound = (msg: string) => {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}