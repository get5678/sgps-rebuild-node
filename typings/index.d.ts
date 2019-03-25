import 'egg';
import 'request-promise';
import { any } from '_@types_bluebird@3.5.26@@types/bluebird';

declare module 'egg' {
  interface Application {
    mysql: any;
    redis: any;
    cos: any;
  }
}