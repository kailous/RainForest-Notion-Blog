export function handleBulletedListBlock(block) {
    const { rich_text } = block.bulleted_list_item;
    const text = rich_text.map((text) => text.plain_text).join('');
  
    return `<li class="list-disc list-inside my-2">${text}</li>`;
  }