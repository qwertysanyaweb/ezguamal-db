export interface Box {
  id: number;
  box_number: string;
  box_address: string;
  box_phone: string;
  box_dataCreate: string;
  box_dataClose: string;
  region: { name: string, id: number }[];
  brand: { name: string, id: number }[];
  post_status: string;
  box_open: BoxOpenList[];
  title: string;
  box_coordinates: string;
  group: { name: string, id: number }[];
}

export interface BoxOpenList {
  'date': string,
  'sum': string,
  'dollar': string,
  'euro': string,
  'rub': string
}

export interface BoxesResponse {
  total: number,
  post: Box[]
}

export interface RequestBoxes {
  offset?: number;
  posts_per_page?: number;
  orderby?: string;
  order?: string;
  post_status?: string;
  p?: number;
  filter_boxNumber?: string;
  filter_brand?: any;
  filter_category?: any;
  filter_startData?: string;
  filter_endData?: string;
}

export interface BoxesPaginationParams {
  currentPage: number;
  total: number;
  posts_per_page: number;
  offset: number;
}

export interface BoxesCategory {
  id: number,
  name: string
}

export interface BoxesCategoryResponse {
  brand: BoxesCategory[],
  region: BoxesCategory[],
  group: BoxesCategory[]
}

export interface RequestReport {
  dateFrom: string,
  dateTo: string,
  objectReport: number,
  boxNumber: null | string,
  brand: null | number[],
  group: null | number[],
}

export interface ResponseReport {
  sum: number,
  dollar: number,
  euro: number,
  rub: number
}

export interface RequestAddBox {
  date: string,
  title: string,
  box_number: string,
  brand: number,
  category: number[],
  coordinates: string,
  phone: string,
  address: string,
  id?: number
  group: number
}

export interface RequestOpenBox {
  'boxNumber': string
  'date': string
  'sum': null | string
  'dollar': null | string,
  'euro': null | string,
  'rub': null | string,
}
