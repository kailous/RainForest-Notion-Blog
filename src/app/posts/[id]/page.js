"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PostPage() {
  const { id } = useParams();  // 获取动态路由参数 id
  const [postContent, setPostContent] = useState(null);

  useEffect(() => {
    fetch(`/api/notion/${id}`)  // 根据 id 调用 API 获取文章和表格内容
      .then((res) => res.json())
      .then((data) => {
        setPostContent(data);
      })
      .catch((error) => console.error("Error fetching post content:", error));
  }, [id]);

  if (!postContent) {
    return <p>Loading...</p>;  // 加载中的状态
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{postContent.title}</h1>

      {/* 使用 dangerouslySetInnerHTML 渲染带有 HTML 表格的内容 */}
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: postContent.content }} />
      </div>
    </div>
  );
}