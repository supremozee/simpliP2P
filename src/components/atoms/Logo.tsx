import Image from 'next/image';

interface LogoProps {
  theme?: 'white' | 'black';
  width?: number;
  height?: number;
  animate?: boolean;
  className?: string;
}

const Logo = ({ theme, width = 50, height = 50, animate = false, className = '' }: LogoProps) => {
  return (
    <Image
      src={theme === 'white' ? '/logo-white.png' : '/logo-black.png'}
      alt='Logo'
      width={width}
      height={height}
      className={`z-10 object-cover bg-cover ${animate ? 'animate-pulse' : ''} ${className}`}
    />
  );
};

export default Logo;