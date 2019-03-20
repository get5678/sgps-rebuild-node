'use strict';
/**
 * @description building interface
 */

export interface Condition {
  pageSize: number;
  current: number;
}

export interface AddInfo {
  id: number;
  name: string;
  is_open: number;
}

export interface ModifyInfo {
  id: number;
  name?: string;
  is_open?: number;
}

export interface UpdateInfo {
  building_name?: string;
  building_is_open?: number;
}
