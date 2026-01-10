import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="RUconnected Logo"
    >
      <rect width="512" height="512" rx="100" className="fill-primary" />
      <text
        x="50%"
        y="52%"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="700"
        fontSize="210"
        fill="white"
        letterSpacing="-0.04em"
      >
        RUc
      </text>
    </svg>
  );
};
