import { Client } from '@notionhq/client';

// 初始化 Notion 客户端
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function handlePageBlock(block) {
  const { id } = block;

  try {
    // 使用 Notion API 获取子页面的详细信息
    const page = await notion.pages.retrieve({ page_id: id });

    // 获取页面标题，兼容不同命名格式
    const title =
      page.properties?.title?.title?.[0]?.plain_text ||   // 常见的 `title` 字段
      page.properties?.Name?.title?.[0]?.plain_text ||   // 如果字段名为 `Name`
      page.properties?.名称?.title?.[0]?.plain_text ||   // 中文字段 `名称`
      'Untitled';  // 如果没有标题，则显示 `Untitled`

    // 生成站点内部的动态路由链接，使用页面标题
    const pageUrl = `/posts/${id}`;

    return `<a href="${pageUrl}" class="text-blue-600 hover:underline block my-4">${title}</a>`;
  } catch (error) {
    console.error(`Error fetching page title for block ID: ${id}`, error);
    return `<a href="#" class="text-red-600 hover:underline block my-4">Failed to load page title</a>`;
  }
}