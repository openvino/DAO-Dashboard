import React from 'react';

const History = (props: React.BaseHTMLAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3v5h5"></path>
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
      <path d="M12 7v5l4 2"></path>
    </svg>
  );
};

export default History;
