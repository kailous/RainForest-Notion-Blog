import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

// 导入块处理函数
import { handleParagraphBlock } from '@/blocks/paragraph';
import { handleHeadingBlock } from '@/blocks/heading';
import { handleToDoBlock } from '@/blocks/todo';
import { handleImageBlock } from '@/blocks/image';
import { handleBulletedListBlock } from '@/blocks/bulletedList';
import { handleNumberedListBlock } from '@/blocks/numberedList';
import { handleCodeBlock } from '@/blocks/code';
import { handleTableBlock } from '@/blocks/table';
import { handleQuoteBlock } from '@/blocks/quote';
import { handleDividerBlock } from '@/blocks/divider';
import { handleFileBlock } from '@/blocks/file';
import { handleVideoBlock } from '@/blocks/video';
import { handleBookmarkBlock } from '@/blocks/bookmark'; // 引入异步的 bookmark 处理函数
import { handlePageBlock } from '@/blocks/page';
import { handlePageLinkBlock } from '@/blocks/pageLink';

// 初始化 Notion 客户端
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET(req, { params }) {
  const { id } = params;

  try {
    // 获取 Notion 页面
    const page = await notion.pages.retrieve({ page_id: id });

    // 获取页面的所有块内容
    const blocks = await notion.blocks.children.list({ block_id: id });

    // 打印 Notion API 返回的原始 JSON 数据到控制台，便于调试
    // console.log('Notion Page Data:', JSON.stringify(page, null, 2));
    // console.log('Notion Blocks Data:', JSON.stringify(blocks, null, 2));

    let content = '';

    // 遍历块，按顺序处理每一个块
    for (const block of blocks.results) {
      switch (block.type) {
        case 'paragraph':
          content += handleParagraphBlock(block);
          break;
        case 'heading_1':
        case 'heading_2':
        case 'heading_3':
          content += handleHeadingBlock(block);
          break;
        case 'to_do':
          content += handleToDoBlock(block);
          break;
        case 'image':
          content += handleImageBlock(block);
          break;
        case 'bulleted_list_item':
          content += handleBulletedListBlock(block);
          break;
        case 'numbered_list_item':
          content += handleNumberedListBlock(block);
          break;
        case 'code':
          content += handleCodeBlock(block);
          break;
        case 'table':
          content += await handleTableBlock(block);  // 表格是异步的
          break;
        case 'quote':
          content += handleQuoteBlock(block);
          break;
        case 'divider':
          content += handleDividerBlock();
          break;
        case 'file':
          content += handleFileBlock(block);
          break;
        case 'video':
          content += handleVideoBlock(block);
          break;
        case 'bookmark':
          content += await handleBookmarkBlock(block);  // 异步处理书签块
          break;
        case 'child_page':
          content += await handlePageBlock(block);  // 确保是异步的
          break;
        case 'link_to_page':
          content += await handlePageLinkBlock(block);  // 确保是异步的
          break;
        case 'audio':
          content += '<p>Audio block is not supported yet.</p>';
          break;
        case 'column_list':
          content += '<p>Column list block is not supported yet.</p>';
          break;
        default:
          console.log(`Unsupported block type: ${block.type}`);
      }
    }

    // 提取页面标题字段，确保字段名的兼容性
    const title = page.properties?.title?.title?.[0]?.plain_text ||
      page.properties?.Name?.title?.[0]?.plain_text ||
      page.properties?.名称?.title?.[0]?.plain_text ||
      'Untitled';  // 如果没有找到标题字段，显示 `Untitled`

    // 返回原始 Notion 数据和处理后的内容给前端
    return NextResponse.json({
      title: title,
      content: content,
      rawPageData: page,   // 返回原始的 Notion 页面数据
      rawBlocksData: blocks // 返回原始的 Notion 块数据
    });

  } catch (error) {
    // 捕获错误并返回 500 状态码
    console.error('Notion API error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch post content' }, { status: 500 });
  }
}