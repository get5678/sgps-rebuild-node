'use strict';
/**
 * @description coupons interface
 */

export interface CouponsAddInfo {
  name: string;
  type: number;
  discount?: number;
  fill?: number;
  price?: number;
  limited_time: Date;
  state?: number;
}

export interface CouponsModifyInfo {
  id: number;
  name?: string;
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
