'use strict';
/**
 * @description user interface
 */

export interface UserUpdate {
  id: number;
  name?: string;
  sex?: number;
  phone?: string;
  // rider_id?: number; /** 是否可以修改或在别处修改 */
}

export interface UserUpdateInfo {
  user_name?: string;
  user_sex?: number;
  user_phone?: string;
}

export interface SearchInfo {
  building?: 'number';
  name?: 'string';
  pageSize?: 'number';
  current?: 'number';
}
