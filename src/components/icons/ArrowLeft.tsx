import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ArrowLeftProps {
  size?: number;
  color?: string;
}

export const ArrowLeft: React.FC<ArrowLeftProps> = ({
  size = 24,
  color = '#FFFFFF',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </Svg>
  );
};

export default ArrowLeft;
