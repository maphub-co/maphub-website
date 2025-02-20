import { Author } from "./user";

/**
 * Dataset request status options
 */
export enum RequestStatus {
  OPEN = "open",
  SUBMITTED = "submitted",
  CLOSED = "closed",
}

/**
 * Dataset request interface
 */
export interface Request {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
  status: RequestStatus;
  tags: string[];
  upvote_count: number;
  submitted_map_id?: string;
  is_validated: boolean;
  user_has_upvoted?: boolean;
}

/**
 * Request comment interface
 */
export interface RequestComment {
  id: string;
  request_id: string;
  author: Author;
  content: string;
  created_at: string;
  is_rejection_reason: boolean;
  parent_id?: string;
  replies?: RequestComment[];
  level?: number;
}

/**
 * Dataset request creation form data
 */
export interface RequestFormData {
  title: string;
  description: string;
  tags: string[];
}

export interface RequestInfos {
  request: Request;
  author: Author;
  user_has_upvoted: boolean;
}

/**
 * Dataset request comment form data
 */
export interface CommentFormData {
  content: string;
  is_rejection_reason?: boolean;
}
