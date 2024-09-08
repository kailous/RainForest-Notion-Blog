export function handleCodeBlock(block) {
    const { rich_text, language } = block.code;
    const code = rich_text.map((text) => text.plain_text).join('');
  
    return `<pre class="bg-gray-100 p-4 rounded my-4"><code class="language-${language}">${code}</code></pre>`;
  }