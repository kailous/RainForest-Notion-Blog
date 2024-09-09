export function handleFileBlock(block) {
    const { file, caption } = block.file;
    const fileUrl = file.url;
  
    const captionText = caption && caption.length > 0
      ? caption.map((richText) => richText.plain_text).join('')
      : '';
  
    return `<a href="${fileUrl}" class="text-blue-600 hover:underline my-4 block">${captionText || "Download File"}</a>`;
  }