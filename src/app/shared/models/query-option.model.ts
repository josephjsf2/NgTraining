import { Pager } from './pager.model';

export class QueryOption {
  queryString?: string;
  pagerString?: string;

  constructor(queryObject: any, pager: Pager<any>) {
    this.queryString = queryObject ? JSON.stringify(queryObject) : null;
    this.pagerString = pager ? JSON.stringify(pager) : null;
  }
}
