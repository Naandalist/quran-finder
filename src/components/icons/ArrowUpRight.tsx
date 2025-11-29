import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ArrowUpRightProps {
  size?: number;
  color?: string;
}

export function ArrowUpRight({ size = 15, color = '#fff' }: ArrowUpRightProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
      <Path
        fill={color}
        d="M11.5 3a.5.5 0 0 1 .5.5V9l-.01.102a.5.5 0 0 1-.98-.001L11 9V4.707l-6.647 6.647a.5.5 0 0 1-.707-.707L10.293 4H6a.5.5 0 0 1 0-1z"
      />
    </Svg>
  );
}
