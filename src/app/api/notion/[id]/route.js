import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
// 导入块
import { handleParagraphBlock } from '@/blocks/paragraph';
import { handleHeadingBlock } from '@/blocks/heading';
import { handleToDoBlock } from '@/blocks/todo';
import { handleImageBlock } from '@/blocks/image';
import { handleBulletedListBlock } from '@/blocks/bulletedList';
import { handleNumberedListBlock } from '@/blocks/numberedList';
import { handleCodeBlock } from '@/blocks/code';
import { handleTableBlock } from '@/blocks/table';

// 初始化 Notion 客户端
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET(req, { params }) {
  const { id } = params;

  try {
    // 获取 Notion 页面
    const page = await notion.pages.retrieve({ page_id: id });

    // 获取页面的所有块内容
    const blocks = await notion.blocks.children.list({ block_id: id });

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
          content += await handleTableBlock(block);
          break;
        default:
          console.log(`Unsupported block type: ${block.type}`);
      }
    }

    const postContent = {
      title: page.properties['名称'].title[0]?.plain_text || 'Untitled',
      content: content,
    };

    return NextResponse.json(postContent);
  } catch (error) {
    console.error('Notion API error:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: 'Failed to fetch post content' }, { status: 500 });
  }
}