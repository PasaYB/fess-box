export const MODERATION_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

export function isModerationStatus(value) {
  return MODERATION_STATUSES.includes(value);
}
