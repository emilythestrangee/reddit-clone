export type Post = {
  id: number | string;
  title: string;
  content?: string;
  body?: string;
  image?: string | null;
  description?: string | null;
  created_at: string;
  updated_at?: string;
  upvotes?: number;
  downvotes?: number;
  nr_of_comments?: number;
  comments?: number;  // Add this
  community?: string; // Add this
  community_id?: number;
  author?: string;
  author_id?: number;
  user_id?: number;
  group?: Group;
  user?: {
    id: number | string;
    username?: string;  // Add this
    name?: string;
    avatar?: string;
    email?: string;
    bio?: string;
    auth_provider?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  comment: string;
  created_at: string;
  upvotes: number;
  user: User;
  replies: Comment[];
}

export type Group = {
  id: string;
  name: string;
  image: string;
}

export type User = {
  id: string;
  name: string;
  image: string | null;
}