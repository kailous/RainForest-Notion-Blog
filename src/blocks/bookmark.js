import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { URL } from 'url';  // Node.js内置模块，用于处理URL

export async function handleBookmarkBlock(block) {
  const { url } = block.bookmark;

  try {
    // 模拟浏览器请求，增加 User-Agent
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}, status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 获取网页的标题、描述、图片
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'No Title';
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || 'No description available';

    // 获取 og:image 或其他可能的图片标签
    let image = $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('link[rel="image_src"]').attr('href') || '';

    // 如果图片地址是相对路径，转换为绝对路径
    if (image && !/^https?:\/\//i.test(image)) {
      const baseUrl = new URL(url);  // 获取书签URL的基本部分
      image = new URL(image, baseUrl).href;  // 将相对路径转换为绝对路径
    }

    // 构建HTML并返回
    return `
<div class="bookmark-container">
  <a href="${url}" target="_blank" class="block">
      ${image ? `<img src="${image}" alt="${title}" class="bookmark-image">` : ''}
    <div class="bookmark-info">
      <h3 class="bookmark-title">${title}</h3>
      <p class="bookmark-description">${description}</p>
      <p class="bookmark-url">${url}</p>
    </div>
  </a>
</div>
    `;
  } catch (error) {
    console.error(`Error fetching bookmark URL ${url}:`, error.message);
    return `<p>Failed to load bookmark from ${url}</p>`;
  }
}