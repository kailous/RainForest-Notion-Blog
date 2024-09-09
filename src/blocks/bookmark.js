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
      <div class="border rounded-lg shadow-lg p-4 my-4 bg-gray-800 text-white">
  <a href="${url}" target="_blank" class="block">
    <div class="flex items-center justify-between">
      <div class="flex-grow pr-4">
        <h3 class="text-2xl font-bold mb-2">${title}</h3>
        <p class="text-gray-300 mb-2">${description}</p>
        <p class="text-blue-400 hover:underline">${url}</p>
      </div>
      ${image ? `<img src="${image}" alt="${title}" class="max-w-xs h-auto object-contain">` : ''}
    </div>
  </a>
</div>
    `;
  } catch (error) {
    console.error(`Error fetching bookmark URL ${url}:`, error.message);
    return `<p>Failed to load bookmark from ${url}</p>`;
  }
}