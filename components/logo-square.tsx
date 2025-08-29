import clsx from 'clsx';
import LogoIcon from './icons/logo';

export default function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  return (
    <div
      className={clsx(
        'flex flex-none items-center justify-center bg-white dark:bg-black',
        {
          'h-[40px] w-[40px] rounded-xl': !size,
          'h-[24px] w-[24px] rounded-lg': size === 'sm'
        }
      )}
    >
      <LogoIcon
        className={clsx({
          'h-[40px] w-[40px]': !size,
          'h-[24px] w-[24px]': size === 'sm'
        })}
      />
    </div>
  );
}
