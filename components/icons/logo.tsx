import clsx from 'clsx';

export default function LogoIcon(props: React.ComponentProps<'img'>) {
  return (
    <img
      src="/images/logo.avif"
      alt="Logo"
      className={clsx('h-8 w-8', props.className)}
      {...props}
    />
  );
}
