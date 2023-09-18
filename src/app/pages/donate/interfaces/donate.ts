export interface Donate {
  title: string;
  amount: string;
  currency: string;
  system: string;
  sign_time: string;
  name: string;
}

export interface DonateResponse {
  total: number,
  post: Donate[]
}

export interface RequestDonate {
  offset?: number;
  posts_per_page?: number;
  orderby?: string;
  order?: string;
  filter_title?: string;
  filter_name?: string;
  filter_system?: any;
  filter_amount?: string;
  filter_startData?: string;
  filter_endData?: string;
}

export interface DonatePaginationParams {
  currentPage: number;
  total: number;
  posts_per_page: number;
  offset: number;
}

export interface DonateReport {
  system: string,
  amount: number,
  percent?: number,
  result?: number
  currency: string
}

export interface DonateReportRequest {
  system: string[],
  id: string,
  dateFrom: string,
  dateTo: string
}
