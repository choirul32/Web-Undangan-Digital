# API Contract

## 1. Purpose
Dokumen ini mendefinisikan kontrak API untuk flow production NusaInvite, terutama admin order-to-publish dan public RSVP.

## 2. Standard Response
Success:
```json
{
  "ok": true,
  "source": "supabase",
  "data": {}
}
```

Error:
```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Slug wajib diisi",
    "details": {
      "field": "slug"
    }
  }
}
```

## 3. Error Codes
| Code | Meaning |
|------|---------|
| `UNAUTHORIZED` | Admin session tidak valid |
| `FORBIDDEN` | Role tidak punya akses |
| `VALIDATION_ERROR` | Payload tidak valid |
| `NOT_FOUND` | Resource tidak ditemukan |
| `CONFLICT` | Slug/id duplikat |
| `STORAGE_ERROR` | Upload/delete file gagal |
| `INTERNAL_ERROR` | Error server tidak terduga |

## 4. Admin APIs
### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`

Required:
- Login harus set HTTP-only cookie.
- Logout harus clear cookie.

### Invitations
- `GET /api/invitations`
- `POST /api/invitations`
- Target: `GET /api/invitations/[slug]`
- Target: `PATCH /api/invitations/[slug]`
- Target: `POST /api/invitations/[slug]/publish`
- Target: `POST /api/invitations/[slug]/archive`

Publish guard:
- `slug` valid dan unique.
- `templateId` ada.
- `groomName`, `brideName` ada.
- Minimal satu event.
- Jika `gift` aktif, minimal satu bank account.
- Jika `guestName` aktif, minimal satu guest untuk personal links.

### Guests
- `GET /api/guests?invitationSlug={slug}`
- `POST /api/guests`
- Target: `PATCH /api/guests/[id]`
- Target: `DELETE /api/guests/[id]`
- Target: `POST /api/guests/import`
- Target: `GET /api/guests/export?invitationSlug={slug}`

Required fields:
- `invitationSlug`
- `name`
- `slug`

Optional fields:
- `group`
- `phone`
- `pax`

### RSVP
- `GET /api/rsvps?invitationSlug={slug}`
- `POST /api/rsvps`
- Target: `GET /api/rsvps/summary?invitationSlug={slug}`

Public POST required fields:
- `invitationSlug`
- `guestName`
- `attendance`

Rules:
- RSVP must resolve invitation by slug.
- If `guestSlug` exists, update matching guest only for that invitation.
- Duplicate RSVP policy must be explicit: allow latest update or block duplicate.

### Media
- `GET /api/media?invitationSlug={slug}`
- `POST /api/media`
- Target: `PATCH /api/media/[id]`
- Target: `DELETE /api/media/[id]`

Rules:
- Upload must be tied to active invitation.
- Validate media type.
- Storage path should include invitation slug/id.

### Content
- `GET /api/events?invitationSlug={slug}`
- `POST /api/events`
- Target: `PATCH /api/events/[id]`
- Target: `DELETE /api/events/[id]`
- Same pattern applies to `stories` and `bank-accounts`.

### Templates
- `GET /api/templates`
- `POST /api/templates`
- `DELETE /api/templates`
- `POST /api/templates/thumbnail`
- `POST /api/templates/ornaments/upload`

Rules:
- Template changes must be backward-compatible with existing invitation design configs.
- Opening cinematic config must live under `widgets.openingSequence`.

## 5. Public APIs
### Public Invitation
- `/u/[slug]` reads only published invitation.
- `/u/[slug]/to/[guestSlug]` reads only guest from the same invitation.

### Public RSVP
- `POST /api/rsvps` must not require admin session.
- Must validate published invitation.
- Must rate limit.

## 6. Required Refactors
- Add validation schema per endpoint.
- Standardize response shape.
- Resolve invitation context in one shared helper.
- Remove hardcoded `dimas-salsa`.
- Add tests for success/error contracts.
