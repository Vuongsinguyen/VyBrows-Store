import clsx from 'clsx';

export default function LogoIcon(props: React.ComponentProps<'img'>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_SITE_URL
    : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  return (
    <img
      src={`${siteUrl}/images/logo.avif`}
      alt="Logo"
      className={clsx('h-8 w-8', props.className)}
      {...props}
    />
  );
}
