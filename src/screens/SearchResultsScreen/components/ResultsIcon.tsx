import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from 'lib/theme/colors';

interface ResultsIconProps {
  size?: number;
  color?: string;
}

export function ResultsIcon({
  size = 20,
  color = colors.gray500,
}: ResultsIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Path
        fill={color}
        d="M18 3v2H2V3zm-6 4v2H2V7zm6 0v2h-4V7zM8 11v2H2v-2zm10 0v2h-8v-2zm-4 4v2H2v-2z"
      />
    </Svg>
  );
}
