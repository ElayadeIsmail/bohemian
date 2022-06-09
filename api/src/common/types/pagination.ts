export interface IPagination<T> {
  items: T[];
  cursor?: number;
  hasMore: boolean;
}
