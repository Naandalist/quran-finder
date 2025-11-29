import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ChevronDownProps {
  size?: number;
  color?: string;
}

export function ChevronDown({ size = 24, color = '#fff' }: ChevronDownProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        d="M36 18L24 30L12 18"
      />
    </Svg>
  );
}
