import { PagedInfo } from "./paged-info";

export interface Paginated<T> {
  entities: T[],
  pagedInfo: PagedInfo
}
