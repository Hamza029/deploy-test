interface IBlogAttributes {
  id: number;
  title: string;
  description: string;
  authorName: string;
  authorUsername: string;
}

export interface IBlog extends IBlogAttributes {}

export interface IBlogInput
  extends Pick<IBlogAttributes, 'title' | 'description'> {}

export interface IBlogDbInput extends Omit<IBlogAttributes, 'id'> {}

export interface IBlogResponse extends IBlogAttributes {}

export interface IBlogUpdateInput
  extends Pick<IBlogAttributes, 'title' | 'description'> {}

export interface IBlogUpdateDbInput
  extends Pick<IBlogAttributes, 'title' | 'description'> {}
