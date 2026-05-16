export const subscriptionStates = ["trial", "active", "grace", "suspended", "canceled"];

export const defaultPlans = [
  {
    id: "manual-starter",
    name: "Manual Starter",
    priceMonthly: 0,
    quotas: {
      invitationsPerMonth: 20,
      activePublishedInvitations: 20,
      storageMb: 512,
      templates: 10,
    },
  },
  {
    id: "studio",
    name: "Studio",
    priceMonthly: 149000,
    quotas: {
      invitationsPerMonth: 100,
      activePublishedInvitations: 100,
      storageMb: 5120,
      templates: 50,
    },
  },
];

export function isSubscriptionUsable(state) {
  return ["trial", "active", "grace"].includes(state);
}

export function isQuotaAvailable({ used = 0, limit = 0 }) {
  if (limit <= 0) {
    return false;
  }

  return Number(used || 0) < Number(limit);
}
