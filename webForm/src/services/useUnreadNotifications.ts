// File: /home/mhatons/unclereuben.v1.0/client/src/services/useUnreadNotifications.ts
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useUnreadNotifications() {
  const user = useQuery(api.resources.users.authenticated);
  
  // Skip the query if user is not authenticated
  const paginationOpts = { numItems: 100, cursor: null };
  const notificationsResult = useQuery(
    api.resources.notifications.list, 
    user ? { 
      email: user.email,
      read: false, // Only get unread notifications
      paginationOpts 
    } : 'skip'
  );

  const unreadCount = notificationsResult?.page?.length || 0;
  
  return { unreadCount };
}