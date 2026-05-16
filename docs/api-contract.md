# API Contract Baseline

## Response Shape
Endpoint baru atau endpoint yang disentuh Phase 1 harus memakai response shape berikut:

Success:
```json
{
  "success": true,
  "source": "supabase",
  "data": {},
  "meta": {}
}
```

Error:
```json
{
  "success": false,
  "code": "validation_error",
  "error": "Payload tidak valid.",
  "details": []
}
```

## Compatibility Rule
Selama dashboard lama masih membaca `data`, `source`, dan `error`, field tersebut wajib tetap ada. Field `success`, `code`, dan `details` ditambahkan untuk standardisasi tanpa memutus UI existing.

## Validation Baseline
Validation helper berada di `src/lib/api-validation.js`.

Phase 1 baseline:
- RSVP public payload divalidasi dan dinormalisasi.
- Slug dinormalisasi ke lowercase URL-safe.
- `attendance` hanya menerima `hadir` atau `tidak_hadir`.
- `pax` dibatasi 1-20.
- `message` dibatasi 500 karakter.

Endpoint admin existing sudah punya required-field guard. Refactor lanjutan harus memindahkan guard tersebut ke schema helper yang sama.

## Logging Baseline
Structured API logs berada di `src/lib/api-logger.js`.

Format:
```json
{
  "level": "error",
  "scope": "rsvps.post.persist",
  "message": "Database error",
  "context": {},
  "timestamp": "2026-05-16T00:00:00.000Z"
}
```

Production upgrade:
- Hubungkan `logApiError` ke Sentry/Logtail/OpenTelemetry.
- Tambah request id.
- Tambah actor id untuk endpoint admin.
