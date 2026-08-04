import { authFetch } from "../../../utlis/authFetch";

// ==========================================
// MY NOTIFICATIONS
// ==========================================

export const getNotifications = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);

  const qs = query.toString();

  return await authFetch(`/notifications${qs ? `?${qs}` : ""}`);
};

// ==========================================
// UNREAD COUNT
// ==========================================

export const getUnreadCount = async () => {
  return await authFetch("/notifications/unread-count");
};

// ==========================================
// MARK ONE AS READ
// ==========================================

export const markNotificationRead = async (notificationId) => {
  return await authFetch(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
};

// ==========================================
// MARK ALL AS READ
// ==========================================

export const markAllNotificationsRead = async () => {
  return await authFetch("/notifications/read-all", {
    method: "PATCH",
  });
};
