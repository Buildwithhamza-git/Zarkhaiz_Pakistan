import { authFetch } from "../../../utlis/authFetch";

// ==========================================
// CONVERSATIONS
// ==========================================

export const getConversations = async (params = {}) => {
  const qs = new URLSearchParams();

  if (params.scope) qs.set("scope", params.scope);

  const query = qs.toString();

  return await authFetch(
    `/chats/conversations${query ? `?${query}` : ""}`
  );
};

export const getUnreadTotal = async (params = {}) => {
  const qs = new URLSearchParams();

  if (params.scope) qs.set("scope", params.scope);

  const query = qs.toString();

  return await authFetch(
    `/chats/conversations/unread-count${query ? `?${query}` : ""}`
  );
};

export const getCustomers = async () => {
  return await authFetch("/chats/customers");
};

export const startConversationApi = async (payload) => {
  return await authFetch("/chats/conversations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getConversationMessages = async (conversationId, params = {}) => {
  const query = new URLSearchParams();

  if (params.before) query.set("before", params.before);
  if (params.limit) query.set("limit", params.limit);

  const qs = query.toString();

  return await authFetch(
    `/chats/conversations/${conversationId}/messages${qs ? `?${qs}` : ""}`
  );
};

// ==========================================
// MESSAGES
// ==========================================

export const sendMessageApi = async (conversationId, payload) => {
  return await authFetch(`/chats/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateMessageApi = async (conversationId, messageId, text) => {
  return await authFetch(
    `/chats/conversations/${conversationId}/messages/${messageId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ text }),
    }
  );
};

export const deleteMessageApi = async (conversationId, messageId) => {
  return await authFetch(
    `/chats/conversations/${conversationId}/messages/${messageId}`,
    {
      method: "DELETE",
    }
  );
};

export const markConversationRead = async (conversationId) => {
  return await authFetch(`/chats/conversations/${conversationId}/read`, {
    method: "POST",
  });
};
