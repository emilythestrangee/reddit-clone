import React, { ReactNode } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';

interface MarkdownTextProps {
  children: string;
  style?: any;
  theme?: 'light' | 'dark';
}

export function MarkdownText({ children, style, theme = 'dark' }: MarkdownTextProps) {
  if (!children) return null;

  const colors = {
    dark: {
      text: '#d7dadc',
      code: '#f8f8f2',
      codeBg: '#2b2b2b',
      quote: '#999',
      quoteLine: '#666',
    },
    light: {
      text: '#030303',
      code: '#1a1a1b',
      codeBg: '#f0f0f0',
      quote: '#666',
      quoteLine: '#ccc',
    },
  };

  const c = colors[theme];

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];

    lines.forEach((line, lineIndex) => {
      if (line.startsWith('> ')) {
        // Quote
        elements.push(
          <View key={lineIndex} style={styles.quoteContainer}>
            <View style={[styles.quoteLine, { backgroundColor: c.quoteLine }]} />
            <Text style={[styles.quoteText, { color: c.quote }]}>
              {line.substring(2)}
            </Text>
          </View>
        );
      } else if (line.startsWith('• ') || /^\d+\.\s/.test(line)) {
        // List item
        elements.push(
          <Text key={lineIndex} style={[styles.listItem, { color: c.text }]}>
            {line}
          </Text>
        );
      } else {
        // Regular text with inline formatting
        elements.push(
          <Text key={lineIndex} style={[styles.text, { color: c.text }]}>
            {parseInlineFormatting(line, c)}
            {lineIndex < lines.length - 1 && '\n'}
          </Text>
        );
      }
    });

    return elements;
  };

  const parseInlineFormatting = (text: string, colors: any): React.ReactNode => {
    const parts: ReactNode[] = [];
    let currentText = text;
    let key = 0;

    // Order matters: process longer patterns first to avoid conflicts
    const patterns = [
      { regex: /~~(.*?)~~/g, style: styles.strikethrough, name: 'strikethrough' },
      { regex: /\*\*(.*?)\*\*/g, style: styles.bold, name: 'bold' },
      { regex: /__(.*?)__/g, style: styles.underline, name: 'underline' },
      { regex: /\*(.*?)\*/g, style: styles.italic, name: 'italic' },
      { regex: /`(.*?)`/g, style: [styles.code, { color: colors.code, backgroundColor: colors.codeBg }], name: 'code' },
    ];

    // Create a combined regex to find all formatting
    const combinedRegex = /(\*\*.*?\*\*|__.*?__|~~.*?~~|\*.*?\*|`.*?`)/g;
    const segments = currentText.split(combinedRegex);

    segments.forEach((segment, index) => {
      if (!segment) return;

      let matched = false;

      // Check each pattern
      for (const pattern of patterns) {
        const match = segment.match(pattern.regex);
        if (match) {
          const content = segment.slice(
            pattern.name === 'strikethrough' ? 2 : pattern.name === 'bold' || pattern.name === 'underline' ? 2 : 1,
            pattern.name === 'strikethrough' ? -2 : pattern.name === 'bold' || pattern.name === 'underline' ? -2 : -1
          );
          parts.push(
            <Text key={`${key++}`} style={pattern.style}>
              {content}
            </Text>
          );
          matched = true;
          break;
        }
      }

      if (!matched) {
        parts.push(segment);
      }
    });

    return parts.length > 0 ? parts : text;
  };

  return (
    <View style={style}>
      {renderMarkdown(children)}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 13,
  },
  quoteContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingLeft: 12,
  },
  quoteLine: {
    width: 3,
    marginRight: 12,
    borderRadius: 2,
  },
  quoteText: {
    flex: 1,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 20,
  },
  listItem: {
    marginVertical: 3,
    lineHeight: 22,
    fontSize: 15,
  },
});