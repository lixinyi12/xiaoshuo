import React, { useEffect, useState } from 'react';
import styles from './Mulu.module.css';
import api from '../api';
import { useSearchParams } from 'react-router-dom';
import Chapter from '../components/Chapter';
import { useMemo } from 'react';
import { NEWEST, TOKEN } from '../constants';
import NovelInfoCard from '../components/NovelInfoCard';
import useAddToShelf from '../hooks/useAddToShelf';
import { decodeToken } from '../utils/token';
import CommentCard from '../components/CommentCard';

export default function Mulu() {
  // 状态管理
  const [allChapters, setAllChapters] = useState([]);
  const [novelData, setNovelData] = useState({
    title: "暂无标题",
    author: "暂无作者",
    tags: [],
    stats: {
      wordCount: "0字",
      updateTime: "无",
      hot: "0",
      rating: 0,
      totalRecommends: "0",
      chapterCount: "0",
    },
    description: "暂无简介"
  });
  const [isCollected, setIsCollected] = useState(false);
  const [comments, setComments] = useState([]);

  // 评论输入
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 防止重复提交

  // 分页状态
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    sortBy: NEWEST
  });

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const token = localStorage.getItem(TOKEN);
  // 解析用户ID，如果token无效则 uid 为 null
  let uid = null;
  try {
    if (token) {
      const decoded = decodeToken(token);
      uid = decoded.uid;
    }
  } catch (e) {
    console.error('Token解析失败', e);
  }

  // 计算当前页显示的章节数据
  const currentPageChapters = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;

    let sortedChapters = [...allChapters];

    if (pagination.sortBy === NEWEST) {
      sortedChapters.sort((a, b) => b.id - a.id);
    } else {
      sortedChapters.sort((a, b) => a.id - b.id);
    }

    const chaptersWithStatus = sortedChapters
      .slice(startIndex, endIndex)
      .map(chapter => ({ ...chapter }));

    return chaptersWithStatus;
  }, [allChapters, pagination]);

  // 处理分页变化
  const handlePageChange = (newPagination) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPagination.currentPage,
      itemsPerPage: newPagination.itemsPerPage
    }));
  };

  // 处理排序变化
  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    setPagination(prev => ({
      ...prev,
      sortBy,
      currentPage: 1
    }));
  };

  // 获取所有章节数据
  const fetchAllChapters = async (novelId) => {
    try {
      const response = await api.getChapterList({ id: novelId });
      setAllChapters(response.data.data || []);
    } catch (error) {
      console.error('获取章节列表失败:', error);
    }
  };

  // 获取评论列表
  const fetchComments = async (novelId) => {
    try {
      const res = await api.novelComments({ novelId });
      setComments(res.data.result || []);
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  };

  // 初始加载
  useEffect(() => {
    if (id) {
      // 获取小说信息
      api.getNovelDetail({ id, userId: uid }).then(res => {
        setIsCollected(res.data.data.is_collected);
        setNovelData(res.data.data);
      });

      // 获取章节数据
      fetchAllChapters(id);

      // 获取评论数据
      fetchComments(id);
    }
  }, [id]);

  const handleAddToShelf = useAddToShelf();
  const handleCollectSuccess = () => {
    if (id) {
      api.getNovelDetail({ id, userId: uid }).then(res => {
        setIsCollected(res.data.data.is_collected);
      });
    }
  };

  // 处理评论输入变化
  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  // 提交评论
  const handleCommentSubmit = async () => {
    if (!token || !uid) {
      alert('请先登录后再评论');
      return;
    }
    if (!commentContent.trim()) {
      alert('评论内容不能为空');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.addComment({
        novelId: Number(id),
        userId: uid,
        content: commentContent.trim()
      });
      setCommentContent(''); // 清空输入框
      // 重新获取评论列表
      await fetchComments(id);
    } catch (error) {
      console.error('评论提交失败', error);
      alert('评论提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.novelDetailPage}>
      {/* 小说信息 */}
      <NovelInfoCard
        {...novelData}
        isCollected={isCollected}
        novelId={id}
        onCollectChange={handleCollectSuccess}
      />

      {/* 章节列表 */}
      <Chapter
        novelId={id}
        chapters={currentPageChapters}
        totalChapters={allChapters.length}
        itemsPerPage={pagination.itemsPerPage}
        currentPage={pagination.currentPage}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        onAddToShelf={handleAddToShelf}
        onCollectChange={handleCollectSuccess}
        isCollected={isCollected}
      />

      {/* 评论区 */}
      <section className={styles.commentSection}>
        <h2 className={styles.sectionTitle}>读者评论</h2>

        {/* 评论输入框 - 仅登录用户可见 */}
        {token && uid ? (
          <div className={styles.commentInputArea}>
            <textarea
              className={styles.commentTextarea}
              placeholder="写下你的评论..."
              value={commentContent}
              onChange={handleCommentChange}
              rows="4"
            />
            <button
              className={styles.submitCommentBtn}
              onClick={handleCommentSubmit}
              disabled={isSubmitting || !commentContent.trim()}
            >
              {isSubmitting ? '提交中...' : '发表评论'}
            </button>
          </div>
        ) : (
          <div className={styles.loginPrompt}>
            请<a href="/signin">登录</a>后发表评论
          </div>
        )}

        {/* 评论列表 */}
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentCard
              key={comment.id || comment.time}
              comment={comment}
            />
          ))
        ) : (
          <p className={styles.noComments}>暂无评论，快来抢沙发吧～</p>
        )}
      </section>
    </div>
  );
}