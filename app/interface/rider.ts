'use strict';
/**
 * @description rider interface
 */

export interface Rider {
  id: number;
  name: string;
  sex?: number;
  phone: string;
  identity_number: string;
}

export interface UpdateRider {
  id: number;
  name?: string;
  sex?: number;
  phone?: string;
  identity_number?: string;
  state?: number;
}

export interface ListCondition {
  pageSize: number;
  current: number;
}

export interface SearchCondition extends ListCondition {
  name: string;
}

export interface RegisteInfo {
  rider_id: number;
  rider_name: string;
  rider_sex?: number;
  rider_phone: string;
  rider_identity_number: string;
  rider_create_time: Date;
}

export interface UpdateInfo {
  rider_name?: string;
  rider_sex?: number;
  rider_phone?: string;
  rider_identity_number?: string;
  rider_state?: number;
}
