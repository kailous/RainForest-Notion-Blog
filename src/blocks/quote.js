export function handleQuoteBlock(block) {
    const { rich_text } = block.quote;
    const text = rich_text.map((text) => text.plain_text).join('');
  
    return `<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">${text}</blockquote>`;
  }