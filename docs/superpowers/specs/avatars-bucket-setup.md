# Avatars storage bucket — required setup

The profile-photo upload writes to a Supabase Storage bucket named **`avatars`**.
Uploads go through a server action using the **service-role** key (bypasses RLS),
so the only thing you must do is create the bucket and make it public-readable.

## One-time setup (Supabase dashboard)

1. **Storage → New bucket**
   - Name: `avatars`
   - **Public bucket: ON** (so the public URLs render in the browser)
   - File size limit: 5 MB (matches the action's `MAX_BYTES`)
   - Allowed MIME types (optional): `image/jpeg, image/png, image/webp, image/avif, image/gif`

2. That's it. No RLS policies are needed because uploads run server-side with the
   service-role client (`createAdminClient`). Reads are public because the bucket
   is public.

### Or via SQL

```sql
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;
```

## How it works in the app

- Upload action: `src/app/account/avatar-actions.ts` → `uploadAvatar()`
  - Stores one file per user at `avatars/<user-id>/avatar.<ext>` (`upsert: true`,
    so re-uploading replaces the old photo).
  - Writes the public URL (cache-busted with `?v=<timestamp>`) to the user's
    `user_metadata.avatar_url` via `auth.admin.updateUserById`.
- Remove: `removeAvatar()` clears `user_metadata.avatar_url` → DiceBear fallback returns.
- Fallback: `src/lib/avatar.ts` → `avatarSrc()` returns the uploaded photo if present,
  otherwise a deterministic DiceBear URL seeded by email/name. No key required.

Until the bucket exists, name edits still work; photo upload will return the
Supabase "bucket not found" error in the modal.
