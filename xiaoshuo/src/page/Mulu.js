import React, { useEffect, useState } from 'react';
import styles from './Mulu.module.css'
import api from '../api'
import { useSearchParams } from 'react-router-dom';
import Chapter from '../components/Chapter'
import { useMemo } from 'react';
import { NEWEST, TOKEN } from '../constants';
import NovelInfoCard from '../components/NovelInfoCard';
import useAddToShelf from '../hooks/useAddToShelf';
import { decodeToken } from '../utils/token'

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

  // 分页状态
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10, // 每页显示章节数
    sortBy: NEWEST
  });

  // 计算当前页显示的章节数据
  const currentPageChapters = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;

    // 排序、分页
    let sortedChapters = [...allChapters];

    if (pagination.sortBy === NEWEST) {
      sortedChapters.sort((a, b) => b.id - a.id);
    } else {
      sortedChapters.sort((a, b) => a.id - b.id);
    }

    const chaptersWithStatus = sortedChapters
      .slice(startIndex, endIndex)
      .map((chapter, index) => ({
        ...chapter
      }));

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

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const token = localStorage.getItem(TOKEN);
  const { uid } = decodeToken(token);

  useEffect(() => {
    if (id) {
      // 获取小说信息
      api.getNovelDetail({ id, userId: uid }).then(res => {
        setIsCollected(res.data.data.is_collected)
        setNovelData(res.data.data)
      });

      fetchAllChapters(id);
    }
  }, [id]);

  // 获取所有章节数据
  const fetchAllChapters = async (novelId) => {
    try {
      const response = await api.getChapterList({ id: novelId });
      setAllChapters(
        response.data.data || []);
    } catch (error) {
      console.error('获取章节列表失败:', error);
    }
  };

  const handleAddToShelf = useAddToShelf();
  const handleCollectSuccess = () => {
    if (id) {
      api.getNovelDetail({ id, userId: uid }).then(res => {
        setIsCollected(res.data.data.is_collected)
      });
    }
  }

  return (
    <div className={styles.novelDetailPage}>
      {/* 小说信息 */}
      <NovelInfoCard {...novelData}
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
        isCollected={isCollected}
      />
    </div>
  );
}