import React from 'react';

const Logo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      {...props}
      src="/openvinoLogo.png"
      alt="Openvino Logo"
      // className="w-28"
      sizes="10rem, 10rem"
    />
  );
};

export default Logo;
