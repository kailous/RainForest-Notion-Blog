export function handleImageBlock(block) {
  const { external, file, caption } = block.image;
  const imageUrl = external ? external.url : file.url;

  // 提取图片的标题（caption）
  const captionText = caption && caption.length > 0
    ? caption.map((richText) => richText.plain_text).join('')
    : '';

  return `
    <figure class="w-full max-w-md mx-auto">
      <img src="${imageUrl}" alt="${captionText}" class="w-full max-w-md mx-auto" />
      ${captionText ? `<figcaption class="text-left text-sm text-gray-500 mt-2 w-full max-w-md mx-auto">${captionText}</figcaption>` : ''}
    </figure>
  `;
}