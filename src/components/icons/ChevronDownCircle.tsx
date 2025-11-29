import React from 'react';
import Svg, { Path, G, Mask, Defs } from 'react-native-svg';

interface ChevronDownCircleProps {
  size?: number;
  color?: string;
}

export function ChevronDownCircle({
  size = 24,
  color = '#fff',
}: ChevronDownCircleProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <Mask id="mask">
          <G fill="none" strokeLinejoin="round" strokeWidth={4}>
            <Path
              fill="#fff"
              stroke="#fff"
              d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"
            />
            <Path stroke="#000" strokeLinecap="round" d="m33 21l-9 9l-9-9" />
          </G>
        </Mask>
      </Defs>
      <Path fill={color} d="M0 0h48v48H0z" mask="url(#mask)" />
    </Svg>
  );
}
