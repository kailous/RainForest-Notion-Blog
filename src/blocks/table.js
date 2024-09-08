import { Client } from '@notionhq/client';

// 初始化 Notion 客户端
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function handleTableBlock(block) {
  if (block.type === 'table') {
    try {
      // 获取表格行
      const tableRows = await notion.blocks.children.list({ block_id: block.id });
      let tableHTML = `
        <table class="table-auto border-collapse border border-gray-300 w-full">
          <tbody>
      `;

      tableRows.results.forEach((row) => {
        if (row.type === 'table_row') {
          tableHTML += '<tr>';
          row.table_row.cells.forEach((cell) => {
            const cellContent = cell.map((richText) => richText.plain_text).join('');
            tableHTML += `<td class="border border-gray-300 p-2">${cellContent}</td>`;
          });
          tableHTML += '</tr>';
        }
      });

      tableHTML += '</tbody></table>';
      return tableHTML;
    } catch (error) {
      console.error('Error processing table block:', error);
      return '<p>Failed to load table content.</p>';
    }
  }
  return '';
}