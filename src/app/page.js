"use client";  // 确保这是客户端组件

import { useEffect, useState } from "react";

export default function Home() {
  const [notionData, setNotionData] = useState([]);

  useEffect(() => {
    // 从自定义 API 获取 Notion 数据
    fetch("/api/notion")
      .then((res) => res.json())
      .then((data) => setNotionData(data))
      .catch((error) => console.error("Error fetching Notion data:", error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Notion Blog</h1>

      {notionData.length > 0 ? (
        <ul>
          {notionData.map((page) => (
            <li key={page.id} className="mb-4">
              <h2 className="text-xl font-semibold">{page.properties['名称'].title[0]?.plain_text || "Untitled"}</h2>
              <p>Category: {page.properties.Category.multi_select.map(cat => cat.name).join(", ") || "None"}</p>
              <a href={`/posts/${page.id}`} className="text-blue-500 hover:underline">Read more</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
}