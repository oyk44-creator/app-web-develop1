"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";

interface LogoImageProps {
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const LogoImage: React.FC<LogoImageProps> = ({
  alt = "Logo",
  width = 80,
  height = 80,
  className = "",
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const src =
    resolvedTheme === "dark"
      ? "/images/logo/퓨처모빌리티AI.png"
      : "/images/logo/퓨처모빌리티AI.png";

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  );
};

export default LogoImage;
