export function handleHeadingBlock(block) {
  const { rich_text } = block[block.type];
  const text = rich_text.map((text) => text.plain_text).join('');

  if (block.type === 'heading_1') {
    return `<h1 class="text-3xl font-bold my-4">${text}</h1>`;
  } else if (block.type === 'heading_2') {
    return `<h2 class="text-2xl font-semibold my-3">${text}</h2>`;
  } else if (block.type === 'heading_3') {
    return `<h3 class="text-xl font-medium my-2">${text}</h3>`;
  }
  return '';
}