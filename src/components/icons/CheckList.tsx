import React from 'react';

const CheckList = (props: React.BaseHTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="10" x2="21" y1="6" y2="6"></line>
      <line x1="10" x2="21" y1="12" y2="12"></line>
      <line x1="10" x2="21" y1="18" y2="18"></line>
      <polyline points="3 6 4 7 6 5"></polyline>
      <polyline points="3 12 4 13 6 11"></polyline>
      <polyline points="3 18 4 19 6 17"></polyline>
    </svg>
  );
};

export default CheckList;
