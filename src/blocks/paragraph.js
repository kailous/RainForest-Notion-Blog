// 段落块处理函数
export function handleParagraphBlock(block) {
  if (block.type === 'paragraph') {
    const paragraphText = block.paragraph.rich_text.map((text) => text.plain_text).join('');
    return `<p>${paragraphText}</p>`;
  }
  return '';
}