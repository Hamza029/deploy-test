import {
  IBlog,
  IBlogDbInput,
  IBlogInput,
  IBlogResponse,
  IBlogUpdateDbInput,
  IBlogUpdateInput,
  IUser,
} from '../../interfaces';

export class BlogDbInputDTO implements IBlogDbInput {
  title: string;
  description: string;
  authorName: string;
  authorUsername: string;

  constructor(blogInput: IBlogInput, user: IUser) {
    this.title = blogInput.title;
    this.description = blogInput.description;
    this.authorName = user.Name;
    this.authorUsername = user.Username;
  }
}

export class BlogResponseDTO implements IBlogResponse {
  id: number;
  title: string;
  description: string;
  authorName: string;
  authorUsername: string;

  constructor(blog: IBlog) {
    this.id = blog.id;
    this.title = blog.title;
    this.description = blog.description;
    this.authorName = blog.authorName;
    this.authorUsername = blog.authorUsername;
  }
}

export class BlogUpdateDbInput implements IBlogUpdateDbInput {
  title: string;
  description: string;

  constructor(blogUpdateInput: IBlogUpdateInput) {
    this.title = blogUpdateInput.title;
    this.description = blogUpdateInput.description;
  }
}
