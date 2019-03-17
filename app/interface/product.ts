'use strict';
/**
 * @description product interface
 */

export interface ProductAddInfo {
  name: string;
  price: string;
  description?: string;
  unit: string;
  category_id: number;
  state?: number;
  img?: string;
}

export interface ProductModifyInfo {
  id: number;
  name?: string;
  price?: string;
  description?: string;
  unit?: string;
  category_id?: number;
  state?: number;
  img?: string;
}

export interface ProductCondition {
  name?: string;
  pageSize: number;
  current: number;
}
