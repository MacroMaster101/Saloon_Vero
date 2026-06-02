import Image from 'next/image';

// Production replacement for the reference <image-slot>. Real image when a url
// is given, else a styled empty placeholder matching the reference empty state.
export function ImgSlot({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`img-slot img-slot--empty ${className ?? ''}`} role="img" aria-label={alt}>
        <span>{alt}</span>
      </div>
    );
  }
  return (
    <div className={`img-slot ${className ?? ''}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 980px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
    </div>
  );
}
