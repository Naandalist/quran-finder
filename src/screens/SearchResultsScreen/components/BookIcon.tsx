import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from 'lib/theme/colors';

interface BookIconProps {
  size?: number;
  color?: string;
}

export function BookIcon({ size = 20, color = colors.gray500 }: BookIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M6.98 21q-.816 0-1.398-.541Q5 19.917 5 19.119V5.766q0-.778.53-1.364t1.306-.748l8.78-1.854v14.616l-8.86 1.919q-.302.069-.529.276q-.227.206-.227.508q0 .39.292.636t.689.245H18V5h1v16zm.405-3.81l1-.207V4.36l-1 .207z"
      />
    </Svg>
  );
}
