import { cn } from '@/lib/utils';

interface BitcoinIconProps {
  className?: string;
  size?: number;
}

export function BitcoinIcon({ className, size = 24 }: BitcoinIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn('bitcoin-icon', className)}
      fill="currentColor"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.5 5.5h1.5v2h-1.5v-2zm-3 0h1.5v2H10.5v-2zm6 3c.828 0 1.5.672 1.5 1.5 0 .608-.364 1.13-.885 1.363.521.232.885.755.885 1.363 0 .828-.672 1.5-1.5 1.5H15v2h-1.5v-2h-3v2H9v-2H7.5v-1.5H9v-5.5H7.5V8H9V6h1.5v2h3V6H15v2h1.5zm-3 1.5h-3v1.5h3v-1.5zm1.5 3h-4.5v1.5h4.5v-1.5z" />
    </svg>
  );
}

export function BitcoinSymbol({ className, size = 24 }: BitcoinIconProps) {
  return (
    <span 
      className={cn('font-bold text-primary', className)} 
      style={{ fontSize: size }}
    >
      ₿
    </span>
  );
}
