// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportErrorHandler from '../../../app/middleware/errorHandler';

declare module 'egg' {
  interface IMiddleware {
    errorHandler: typeof ExportErrorHandler;
  }
}
