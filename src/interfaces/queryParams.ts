interface IQueryParams {
  authorUsername?: string;
  search?: string;
  page?: string;
}

export interface IBlogQueryParams
  extends Pick<IQueryParams, 'authorUsername' | 'page'> {}

export interface IUserQueryParams extends Pick<IQueryParams, 'page'> {}
