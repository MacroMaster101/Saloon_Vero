// Avatar resolution: an uploaded photo always wins; otherwise we fall back to
// a deterministic DiceBear avatar seeded by the user's email or name, so every
// account gets a stable, friendly default with no upload required.
//
// DiceBear's HTTP API is public and key-less: https://www.dicebear.com/

const DICEBEAR_STYLE = 'initials'; // clean lettered avatars that match the brand
const DICEBEAR_BASE = `https://api.dicebear.com/9.x/${DICEBEAR_STYLE}/svg`;

/** A stable DiceBear URL for the given seed (email > name > 'guest'). */
export function dicebearUrl(seed: string | null | undefined): string {
  const s = (seed ?? '').trim() || 'guest';
  const params = new URLSearchParams({
    seed: s,
    backgroundType: 'gradientLinear',
    backgroundColor: 'd99a3d,b8742a', // brand gold gradient
    fontWeight: '700',
  });
  return `${DICEBEAR_BASE}?${params.toString()}`;
}

/** Resolve the avatar to render: uploaded photo, else DiceBear fallback. */
export function avatarSrc(uploaded: string | null | undefined, seed: string | null | undefined): string {
  const u = (uploaded ?? '').trim();
  return u || dicebearUrl(seed);
}
