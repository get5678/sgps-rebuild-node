'use strict';

/**
 * @description return msg and data
 */

export default interface Deal {
  success(data): void;
  error(params): void;
  notFound(msg: string): void;
}
