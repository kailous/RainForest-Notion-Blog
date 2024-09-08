import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// 初始化 Notion 客户端，使用环境变量中的 API 密钥
const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET() {
  try {
    // 从环境变量中获取数据库 ID
    const databaseId = process.env.NOTION_DATABASE_ID;

    // 查询 Notion 数据库
    const response = await notion.databases.query({ database_id: databaseId });

    // 打印 API 响应以进行调试
    console.log("Notion API response:", response);

    // 返回数据库查询结果
    return NextResponse.json(response.results);
  } catch (error) {
    // 打印错误信息以进行调试
    console.error("Notion API error:", error);

    // 返回错误响应
    return NextResponse.json({ error: "Failed to fetch data from Notion" }, { status: 500 });
  }
}