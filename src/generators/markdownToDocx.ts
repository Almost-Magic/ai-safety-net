/**
 * markdownToDocx.ts
 * Converts markdown strings to professional .docx Word documents
 * Uses the 'docx' library (already in package.json)
 * 
 * AI Safety Net — Almost Magic Tech Lab
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  BorderStyle,
  WidthType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  PageBreak,
} from 'docx';

// ============================================================================
// TYPES
// ============================================================================

interface DocxOptions {
  /** Document title shown in header */
  title?: string;
  /** Organisation name for footer */
  organisation?: string;
  /** Primary brand colour (hex without #) */
  accentColor?: string;
}

// ============================================================================
// MARKDOWN PARSER
// ============================================================================

interface ParsedBlock {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'paragraph' | 'bullet' | 'numbered' | 'hr' | 'table' | 'checkbox' | 'blockquote';
  content: string;
  rows?: string[][];  // for tables
  checked?: boolean;  // for checkboxes
  level?: number;     // indent level for nested bullets
}

function parseMarkdownBlocks(markdown: string): ParsedBlock[] {
  const lines = markdown.split('\n');
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed) || /^_{3,}$/.test(trimmed)) {
      blocks.push({ type: 'hr', content: '' });
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      blocks.push({ type: 'h4', content: trimmed.slice(5).trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', content: trimmed.slice(4).trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', content: trimmed.slice(3).trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', content: trimmed.slice(2).trim() });
      i++;
      continue;
    }

    // Table (starts with |)
    if (trimmed.startsWith('|')) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = lines[i].trim();
        // Skip separator rows like |---|---|
        if (!/^\|[\s-:|]+\|$/.test(row)) {
          const cells = row
            .split('|')
            .slice(1, -1) // remove first and last empty elements
            .map(c => c.trim());
          tableRows.push(cells);
        }
        i++;
      }
      if (tableRows.length > 0) {
        blocks.push({ type: 'table', content: '', rows: tableRows });
      }
      continue;
    }

    // Checkbox items
    if (/^[-*]\s*\[[ x]\]/.test(trimmed)) {
      const checked = /\[x\]/i.test(trimmed);
      const content = trimmed.replace(/^[-*]\s*\[[ x]\]\s*/, '');
      blocks.push({ type: 'checkbox', content, checked });
      i++;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s+/, '');
      blocks.push({ type: 'numbered', content });
      i++;
      continue;
    }

    // Bullet list (including nested)
    if (/^[-*+]\s/.test(trimmed) || /^\s+[-*+]\s/.test(line)) {
      const indent = line.search(/\S/);
      const level = Math.floor(indent / 2);
      const content = trimmed.replace(/^[-*+]\s+/, '');
      blocks.push({ type: 'bullet', content, level: level });
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      let quoteContent = trimmed.replace(/^>\s*/, '');
      i++;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteContent += ' ' + lines[i].trim().replace(/^>\s*/, '');
        i++;
      }
      blocks.push({ type: 'blockquote', content: quoteContent });
      continue;
    }

    // Regular paragraph (accumulate consecutive non-empty lines)
    let para = trimmed;
    i++;
    // Don't merge lines that look like list items, headings, tables, etc.
    while (i < lines.length && lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('-') &&
      !lines[i].trim().startsWith('*') &&
      !lines[i].trim().startsWith('>') &&
      !/^\d+\.\s/.test(lines[i].trim())) {
      para += ' ' + lines[i].trim();
      i++;
    }
    blocks.push({ type: 'paragraph', content: para });
  }

  return blocks;
}

// ============================================================================
// INLINE FORMATTING PARSER
// ============================================================================

/**
 * Parse inline markdown formatting (bold, italic, code) into TextRun objects
 */
function parseInlineFormatting(text: string, baseSize: number = 22): TextRun[] {
  const runs: TextRun[] = [];

  // Strip markdown link syntax: [text](url) → text (url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

  // Pattern: **bold**, *italic*, `code`, ***bold italic***
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before this match
    if (match.index > lastIndex) {
      runs.push(new TextRun({
        text: text.slice(lastIndex, match.index),
        size: baseSize,
        font: 'Calibri',
      }));
    }

    if (match[2]) {
      // ***bold italic***
      runs.push(new TextRun({
        text: match[2],
        bold: true,
        italics: true,
        size: baseSize,
        font: 'Calibri',
      }));
    } else if (match[3]) {
      // **bold**
      runs.push(new TextRun({
        text: match[3],
        bold: true,
        size: baseSize,
        font: 'Calibri',
      }));
    } else if (match[4]) {
      // *italic*
      runs.push(new TextRun({
        text: match[4],
        italics: true,
        size: baseSize,
        font: 'Calibri',
      }));
    } else if (match[5]) {
      // `code`
      runs.push(new TextRun({
        text: match[5],
        font: 'Consolas',
        size: baseSize - 2,
        shading: { type: ShadingType.CLEAR, fill: 'F0F0F0' },
      }));
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    runs.push(new TextRun({
      text: text.slice(lastIndex),
      size: baseSize,
      font: 'Calibri',
    }));
  }

  // If no formatting found, return single run
  if (runs.length === 0) {
    runs.push(new TextRun({
      text,
      size: baseSize,
      font: 'Calibri',
    }));
  }

  return runs;
}

// ============================================================================
// DOCX BUILDER
// ============================================================================

function buildTable(rows: string[][], accentColor: string): Table {
  const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
  const borders = { top: border, bottom: border, left: border, right: border };
  const contentWidth = 9026; // A4 with 1" margins

  if (rows.length === 0) {
    return new Table({
      width: { size: contentWidth, type: WidthType.DXA },
      rows: [new TableRow({
        children: [new TableCell({
          borders,
          children: [new Paragraph({ children: [new TextRun('Empty table')] })],
        })],
      })],
    });
  }

  const colCount = Math.max(...rows.map(r => r.length));
  const colWidth = Math.floor(contentWidth / colCount);
  const columnWidths = Array(colCount).fill(colWidth);
  // Adjust last column to absorb rounding
  columnWidths[colCount - 1] = contentWidth - colWidth * (colCount - 1);

  return new Table({
    width: { size: contentWidth, type: WidthType.DXA },
    columnWidths,
    rows: rows.map((row, rowIndex) =>
      new TableRow({
        children: Array.from({ length: colCount }, (_, ci) =>
          new TableCell({
            borders,
            width: { size: columnWidths[ci], type: WidthType.DXA },
            shading: rowIndex === 0
              ? { fill: accentColor, type: ShadingType.CLEAR }
              : rowIndex % 2 === 0
                ? { fill: 'F5F5F5', type: ShadingType.CLEAR }
                : undefined,
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({
              children: parseInlineFormatting(row[ci] || '', 20).map(run => {
                // Make header row bold and white
                if (rowIndex === 0) {
                  return new TextRun({
                    text: (run as any).options?.text || '',
                    bold: true,
                    size: 20,
                    font: 'Calibri',
                    color: 'FFFFFF',
                  });
                }
                return run;
              }),
            })],
          })
        ),
      })
    ),
  });
}

/**
 * Convert a markdown string to a docx Document blob
 */
export async function markdownToDocxBlob(
  markdown: string,
  options: DocxOptions = {}
): Promise<Blob> {
  const {
    title = '',
    organisation = 'AI Safety Net',
    accentColor = '1B2A4A',
  } = options;

  const blocks = parseMarkdownBlocks(markdown);
  const children: (Paragraph | Table)[] = [];

  let bulletRef = 0;
  let numberRef = 0;

  // Build numbered list configs dynamically
  const numberingConfigs: any[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'h1':
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 360, after: 200 },
          children: [new TextRun({
            text: block.content,
            bold: true,
            size: 36,
            font: 'Calibri',
            color: accentColor,
          })],
        }));
        break;

      case 'h2':
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 160 },
          children: [new TextRun({
            text: block.content,
            bold: true,
            size: 28,
            font: 'Calibri',
            color: accentColor,
          })],
        }));
        break;

      case 'h3':
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 120 },
          children: [new TextRun({
            text: block.content,
            bold: true,
            size: 24,
            font: 'Calibri',
            color: '333333',
          })],
        }));
        break;

      case 'h4':
        children.push(new Paragraph({
          spacing: { before: 200, after: 100 },
          children: [new TextRun({
            text: block.content,
            bold: true,
            italics: true,
            size: 22,
            font: 'Calibri',
            color: '555555',
          })],
        }));
        break;

      case 'hr':
        children.push(new Paragraph({
          spacing: { before: 200, after: 200 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC', space: 1 },
          },
          children: [new TextRun({ text: '' })],
        }));
        break;

      case 'bullet': {
        const ref = `bullets_${bulletRef}`;
        if (!numberingConfigs.find(c => c.reference === ref)) {
          numberingConfigs.push({
            reference: ref,
            levels: [
              {
                level: 0,
                format: LevelFormat.BULLET,
                text: '\u2022',
                alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 720, hanging: 360 } } },
              },
              {
                level: 1,
                format: LevelFormat.BULLET,
                text: '\u25E6',
                alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 1440, hanging: 360 } } },
              },
            ],
          });
        }
        children.push(new Paragraph({
          numbering: { reference: ref, level: Math.min(block.level || 0, 1) },
          spacing: { before: 40, after: 40 },
          children: parseInlineFormatting(block.content),
        }));
        break;
      }

      case 'numbered': {
        const ref = `numbers_${numberRef}`;
        if (!numberingConfigs.find(c => c.reference === ref)) {
          numberingConfigs.push({
            reference: ref,
            levels: [{
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            }],
          });
        }
        children.push(new Paragraph({
          numbering: { reference: ref, level: 0 },
          spacing: { before: 40, after: 40 },
          children: parseInlineFormatting(block.content),
        }));
        break;
      }

      case 'checkbox':
        children.push(new Paragraph({
          spacing: { before: 40, after: 40 },
          indent: { left: 720 },
          children: [
            new TextRun({
              text: block.checked ? '☑ ' : '☐ ',
              font: 'Segoe UI Symbol',
              size: 22,
            }),
            ...parseInlineFormatting(block.content),
          ],
        }));
        break;

      case 'blockquote':
        children.push(new Paragraph({
          spacing: { before: 120, after: 120 },
          indent: { left: 720 },
          border: {
            left: { style: BorderStyle.SINGLE, size: 3, color: accentColor, space: 8 },
          },
          children: parseInlineFormatting(block.content).map(run => {
            return new TextRun({
              text: (run as any).options?.text || '',
              italics: true,
              size: 22,
              font: 'Calibri',
              color: '555555',
            });
          }),
        }));
        break;

      case 'table':
        if (block.rows) {
          children.push(buildTable(block.rows, accentColor));
          children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
        }
        break;

      case 'paragraph':
        children.push(new Paragraph({
          spacing: { before: 80, after: 80 },
          children: parseInlineFormatting(block.content),
        }));
        break;
    }
  }

  // Increment refs for next list sequence
  bulletRef++;
  numberRef++;

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22 },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 36, bold: true, font: 'Calibri', color: accentColor },
          paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 28, bold: true, font: 'Calibri', color: accentColor },
          paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 24, bold: true, font: 'Calibri', color: '333333' },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
        },
      ],
    },
    numbering: {
      config: numberingConfigs,
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({
              text: title || organisation,
              size: 16,
              color: '999999',
              font: 'Calibri',
              italics: true,
            })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${organisation}  |  Page `,
                size: 16,
                color: '999999',
                font: 'Calibri',
              }),
              new TextRun({
                children: [PageNumber.CURRENT],
                size: 16,
                color: '999999',
                font: 'Calibri',
              }),
            ],
          })],
        }),
      },
      children,
    }],
  });

  return Packer.toBlob(doc);
}

