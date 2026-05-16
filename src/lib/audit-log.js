import { logApiError } from "./api-logger";

export async function writeAuditLog(supabase, entry = {}) {
  const row = {
    tenant_id: entry.tenantId || null,
    actor_user_id: entry.actorUserId || null,
    actor_email: entry.actorEmail || null,
    action: entry.action,
    entity_type: entry.entityType,
    entity_id: entry.entityId || null,
    metadata: entry.metadata || {},
  };

  try {
    const { error } = await supabase.from("audit_logs").insert(row);

    if (error) {
      logApiError("audit.insert", error, {
        action: row.action,
        entityType: row.entity_type,
        entityId: row.entity_id,
      });
    }
  } catch (error) {
    logApiError("audit.unhandled", error, {
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
    });
  }
}
