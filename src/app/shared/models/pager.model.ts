export class Pager<T> {
  currentPage?: number;
  pageSize?: number;
  maxPage?: number;
  totalCount?: number;
  resultList?: T[];
}
