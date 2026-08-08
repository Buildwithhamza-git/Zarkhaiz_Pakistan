import { authFetch } from "../../../utlis/authFetch";

// ==========================================
// EARNINGS SUMMARY (current seller)
// ==========================================

export const getEarningsSummary = async () => {
  return await authFetch("/payouts/earnings");
};

// ==========================================
// ANALYTICS (current seller)
// ==========================================

export const getAnalytics = async () => {
  return await authFetch("/payouts/analytics");
};

// ==========================================
// LIST PAYOUTS (current seller)
// ==========================================

export const getMyPayouts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return await authFetch(
    `/payouts${query ? `?${query}` : ""}`
  );
};

// ==========================================
// REQUEST A PAYOUT
// ==========================================

export const requestPayout = async (payload = {}) => {
  return await authFetch("/payouts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ==========================================
// CANCEL A PAYOUT (seller)
// ==========================================

export const cancelPayout = async (payoutId) => {
  if (!payoutId) {
    throw new Error("Payout ID is required.");
  }

  return await authFetch(`/payouts/${payoutId}/cancel`, {
    method: "PATCH",
  });
};
