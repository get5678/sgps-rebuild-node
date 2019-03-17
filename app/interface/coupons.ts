'use strict';
/**
 * @description coupons interface
 */

export interface CouponsAddInfo {
  type: number;
  discount?: number;
  fill?: number;
  price?: number;
  limited_time: Date;
  state?: number;
}

export interface CouponsModifyInfo {
  id: number;
  type?: number;
  discount?: number;
  fill?: number;
  price?: number;
  limited_time?: Date;
  state?: number;
}

export interface CouponsCondition {
  pageSize?: number;
  current?: number;
}
