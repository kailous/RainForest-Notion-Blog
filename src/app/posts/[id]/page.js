"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PostPage() {
  const { id } = useParams();  // 获取动态路由参数 id
  const [postContent, setPostContent] = useState(null);
  const [loading, setLoading] = useState(true);  // 添加 loading 状态

  useEffect(() => {
    if (id) {
      fetch(`/api/notion/${id}`)  // 根据 id 调用 API 获取文章和表格内容
        .then((res) => res.json())
        .then((data) => {
          setPostContent(data);
          setLoading(false);  // 加载完成
        })
        .catch((error) => {
          console.error("Error fetching post content:", error);
          setLoading(false);  // 即使发生错误，也要取消加载状态
        });
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;  // 加载中的状态
  }

  if (!postContent) {
    return <p>No content found.</p>;  // 如果没有文章内容，显示提示
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{postContent.title || "Untitled"}</h1>

      {/* 使用 dangerouslySetInnerHTML 渲染带有 HTML 表格的内容 */}
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: postContent.content }} />
      </div>
    </div>
  );
}