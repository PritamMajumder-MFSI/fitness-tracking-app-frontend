export interface Notification {
  _id: string;
  userId: string;
  goalId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  totalNotifications: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: Pagination;
}
