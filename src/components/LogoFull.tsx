import React from 'react';

const Logo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return <img {...props} src="/openvinoLogo.png" alt="Openvino Logo" />;
};

export default Logo;
