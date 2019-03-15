'use strict';
/**
 * @description category interface
 */

export interface CategoryAdd {
  id?: number;
  name?: string;
}

export interface CategoryModify extends CategoryAdd {
  state?: number;
  is_delete?: number;
}

export interface ModifyInfo {
  category_name?: string;
  category_state?: number;
  category_is_delete?: number;
}

export interface Condition {
  pageSize: number;
  current: number;
  name?: string;
}
