import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { normalizeLatin, stripVowels } from 'lib/quran/normalizeLatin';
import { colors } from 'lib/theme/colors';

interface HighlightedTextProps extends TextProps {
  /**
   * The full text to display
   */
  text: string;
  /**
   * The query substring to highlight (uses phonetic normalization for matching)
   */
  query?: string;
  /**
   * Background color for highlighted segments
   * @default colors.highlight (#22c55e)
   */
  highlightColor?: string;
  /**
   * Text color for highlighted segments
   * @default inherited from parent
   */
  highlightTextColor?: string;
}

/**
 * A Text component that highlights all occurrences of a query substring.
 * Uses phonetic normalization for matching (handles diacritics, q→k, sy→sh, etc.)
 * but preserves original text in the display.
 */
export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  query,
  highlightColor = colors.highlight,
  highlightTextColor,
  style,
  ...textProps
}) => {
  // If no query or empty query, render plain text
  if (!query || query.trim().length === 0) {
    return (
      <Text style={style} {...textProps}>
        {text}
      </Text>
    );
  }

  const segments = getHighlightedSegments(text, query);

  const highlightStyle: TextStyle = {
    backgroundColor: highlightColor + '30', // Add 30% opacity to the color
    fontWeight: '600',
    color: highlightColor, // Use highlight color for text instead of background
    ...(highlightTextColor ? { color: highlightTextColor } : {}),
  };

  return (
    <Text style={style} {...textProps}>
      {segments.map((segment, index) =>
        segment.isHighlight ? (
          <Text key={index} style={highlightStyle}>
            {segment.text}
          </Text>
        ) : (
          <Text key={index}>{segment.text}</Text>
        ),
      )}
    </Text>
  );
};

interface TextSegment {
  text: string;
  isHighlight: boolean;
}

/**
 * Build a mapping from normalized string positions back to original string positions.
 * We normalize incrementally by adding one character at a time to track boundaries.
 */
function buildPositionMap(
  text: string,
  transform: (s: string) => string,
): { transformed: string; normToOrig: number[] } {
  const normToOrig: number[] = []; // For each transformed char, which original char produced it?

  let prevLen = 0;

  for (let i = 0; i < text.length; i++) {
    // Transform text up to and including position i
    const transformedUpToI = transform(text.slice(0, i + 1));

    // For each new transformed char, record which original char it came from
    for (let j = prevLen; j < transformedUpToI.length; j++) {
      normToOrig.push(i);
    }

    prevLen = transformedUpToI.length;
  }

  const transformed = transform(text);

  return { transformed, normToOrig };
}

/**
 * Find matches using a specific transformation function.
 */
function findMatches(
  text: string,
  query: string,
  transform: (s: string) => string,
): Array<{ start: number; end: number }> {
  const transformedQuery = transform(query);

  if (!transformedQuery) {
    return [];
  }

  const { transformed: transformedText, normToOrig } = buildPositionMap(
    text,
    transform,
  );

  const matches: Array<{ start: number; end: number }> = [];
  let searchPos = 0;

  while (searchPos < transformedText.length) {
    const matchIndex = transformedText.indexOf(transformedQuery, searchPos);
    if (matchIndex === -1) break;

    // Map transformed positions back to original positions
    const transStart = matchIndex;
    const transEnd = matchIndex + transformedQuery.length;

    // Get original start position
    const origStart = normToOrig[transStart] ?? 0;

    // Get original end position
    let origEnd: number;
    if (transEnd >= normToOrig.length) {
      origEnd = text.length;
    } else {
      origEnd = normToOrig[transEnd] ?? text.length;
    }

    matches.push({ start: origStart, end: origEnd });
    searchPos = transEnd;
  }

  return matches;
}

/**
 * Split text into segments, marking which parts match the query.
 * Uses phonetic normalization for matching, with skeleton matching as fallback.
 */
function getHighlightedSegments(text: string, query: string): TextSegment[] {
  const normalizedQuery = normalizeLatin(query);

  if (!normalizedQuery) {
    return [{ text, isHighlight: false }];
  }

  // First try normalized matching
  let matches = findMatches(text, query, normalizeLatin);

  // If no normalized matches, try skeleton matching as fallback
  if (matches.length === 0) {
    const skeletonTransform = (s: string) => stripVowels(normalizeLatin(s));
    matches = findMatches(text, query, skeletonTransform);
  }

  if (matches.length === 0) {
    return [{ text, isHighlight: false }];
  }

  // Build segments from matches
  const segments: TextSegment[] = [];
  let currentPos = 0;

  for (const match of matches) {
    // Add non-matching text before this match
    if (match.start > currentPos) {
      segments.push({
        text: text.slice(currentPos, match.start),
        isHighlight: false,
      });
    }

    // Add the matching text
    segments.push({
      text: text.slice(match.start, match.end),
      isHighlight: true,
    });

    currentPos = match.end;
  }

  // Add remaining text after last match
  if (currentPos < text.length) {
    segments.push({
      text: text.slice(currentPos),
      isHighlight: false,
    });
  }

  return segments;
}

export default HighlightedText;
