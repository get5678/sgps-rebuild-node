'use strict';

import { Controller } from 'egg';
import Deal from '../interface/deal';
import { Code } from '../utils/code';

export default class BaseController extends Controller implements Deal {
  success = (data: any) => {
    const code: number = 1;
    this.ctx.body = {
      code,
      msg: Code[code],
      data,
    };
  }

  error = (param?: any) => {
    const { code } = param;
    this.ctx.body = {
      code: code ? code : -1,
      msg: Code[code],
    };
  }

  notFound = (msg: string) => {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}
