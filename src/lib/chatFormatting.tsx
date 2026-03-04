import { Fragment, type ReactNode } from 'react';

function renderInlineBold(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(text)) !== null) {
    const [fullMatch, boldText] = match;
    const start = match.index;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    nodes.push(<strong key={`bold-${start}`}>{boldText}</strong>);
    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

export function renderSimpleMarkdown(text: string): ReactNode {
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => (
    <Fragment key={`line-${lineIndex}`}>
      {renderInlineBold(line)}
      {lineIndex < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
}
