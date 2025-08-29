import clsx from 'clsx';
import Label from '../label';

type ImgProps = {
  // allow callers to pass either a string URL or an image object (e.g. { url, altText })
  src?: any;
  alt?: string;
  width?: number;
  height?: number;
  [key: string]: any;
};

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
  } & ImgProps) {
  // Normalize src/alt when callers pass an image object instead of a string
  const resolvedSrc = (() => {
    const s = (props as any).src;
    if (!s) return '';
    if (typeof s === 'string') return s;
    if (typeof s === 'object') {
      if (typeof s.url === 'string') return s.url;
      if (typeof s.src === 'string') return s.src;
      // If the object has a nested 'image' or 'thumbnail'
      if (typeof s.image === 'string') return s.image;
    }
    return String(s);
  })();

  const resolvedAlt = (() => {
    const a = (props as any).alt;
    if (a && typeof a === 'string') return a;
    const s = (props as any).src;
    if (s && typeof s === 'object') {
      if (typeof s.altText === 'string') return s.altText;
      if (typeof s.alt === 'string') return s.alt;
    }
    return '';
  })();
  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-[#003324] dark:bg-black',
        {
          relative: label,
          'border-2 border-[#003324]': active,
          'border-neutral-200 dark:border-neutral-800': !active
        }
      )}
    >
      {resolvedSrc ? (
        // Render a plain <img> so SSR contains a real src attribute even before hydration
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={clsx('relative h-full w-full object-contain', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
          })}
          src={resolvedSrc}
          alt={resolvedAlt}
          width={
            (props as any).width || (typeof (props as any).src === 'object' ? (props as any).src.width : undefined)
          }
          height={
            (props as any).height || (typeof (props as any).src === 'object' ? (props as any).src.height : undefined)
          }
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
