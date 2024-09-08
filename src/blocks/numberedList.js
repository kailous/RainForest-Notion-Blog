export function handleNumberedListBlock(block) {
    const { rich_text } = block.numbered_list_item;
    const text = rich_text.map((text) => text.plain_text).join('');
  
    return `<li class="list-decimal list-inside my-2">${text}</li>`;
  }