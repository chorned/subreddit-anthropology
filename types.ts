export interface Post {
  id: string;
  title: string;
  selftext: string;
  author: string;
  createdAt: number; // Unix timestamp (seconds since epoch)
}

export interface Comment {
  id: string;
  body: string;
  author: string;
}

export interface PostWithComments extends Post {
  comments: Comment[];
}

export interface RedditData {
  posts: PostWithComments[];
}