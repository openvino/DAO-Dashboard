import { cn } from '@/src/lib/utils';
import React from 'react';

const Loading = ({
  className,
  ...props
}: React.BaseHTMLAttributes<SVGElement>) => {
  return (
    <div className={cn(className, 'p-0.5')}>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          fill="currentColor"
          className="origin-center animate-spin"
          d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
        />
      </svg>
    </div>
  );
};

export default Loading;
