export interface Menu {
  'title': string,
  'link': string,
  'icon'?: string,
  'hidden': boolean,
  'id'?: string,
  'children'?: Menu[],
}
