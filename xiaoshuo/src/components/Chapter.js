import { NEWEST, OLDEST } from '../constants';
import styles from './Chapter.module.css';
import Pagination from './Pagination';
import { useState, useMemo } from 'react';
import { getNovelReadPath } from '../constants/link';

export default function Chapter({
  novelId,
  chapters,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  onAddToShelf,
  isCollected
}) {
  const [sortOrder, setSortOrder] = useState(NEWEST);

  // 使用 useMemo 缓存排序结果
  const sortedChapterList = useMemo(() => {
    if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
      return [];
    }

    try {
      // 创建副本以避免修改原数组
      const chaptersCopy = [...chapters];

      // 确保每个章节都有 chapter_number 属性
      const validChapters = chaptersCopy.filter(chapter =>
        chapter && typeof chapter === 'object' &&
        chapter.chapter_number !== undefined &&
        chapter.chapter_number !== null
      );

      if (validChapters.length === 0) {
        console.warn('没有有效的章节数据');
        return chaptersCopy;
      }

      let sorted;
      if (sortOrder === NEWEST) {
        // 按最新排序：章节号从大到小
        sorted = validChapters.sort((a, b) => {
          const numA = Number(a.chapter_number) || 0;
          const numB = Number(b.chapter_number) || 0;
          return numB - numA;
        });
      } else if (sortOrder === OLDEST) {
        // 按最早排序：章节号从小到大
        sorted = validChapters.sort((a, b) => {
          const numA = Number(a.chapter_number) || 0;
          const numB = Number(b.chapter_number) || 0;
          return numA - numB;
        });
      } else {
        sorted = validChapters;
      }

      return sorted;
    } catch (error) {
      console.error('排序出错:', error);
      return chapters || [];
    }
  }, [chapters, sortOrder]);

  // 处理排序变化
  const handleSortChange = (event) => {
    if (!event) {
      console.error('handleSortChange called without event');
      return;
    }

    // 安全地获取value
    const newSortOrder = event?.target?.value;

    if (!newSortOrder) {
      console.error('无法获取排序值');
      return;
    }

    setSortOrder(newSortOrder);
  };

  // 处理分页变化
  const handlePaginationChange = (pagination) => {
    if (onPageChange && typeof onPageChange === 'function') {
      onPageChange(pagination);
    }
  };

  // 获取当前页的章节
  const getCurrentPageChapters = () => {
    if (!sortedChapterList || sortedChapterList.length === 0) {
      return [];
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedChapterList.slice(startIndex, endIndex);
  };

  // 如果没有章节数据，显示空状态
  if (!chapters || chapters.length === 0) {
    return (
      <section className={styles.chapterListContainer}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <i className="fa fa-book-open"></i>
          </div>
          <h3 className={styles.emptyTitle}>作者尚未发布新章节</h3>
          <p className={styles.emptyText}>敬请期待作者更新，您可以将小说加入书架以便及时收到更新通知</p>
          {onAddToShelf && (
            <button
              className={styles.addToShelfBtn}
              onClick={onAddToShelf}
            >
              <i className="fa fa-bookmark"></i> 加入书架
            </button>
          )}
        </div>
      </section>
    );
  }

  const currentPageChapters = getCurrentPageChapters();
  const totalPages = Math.ceil(sortedChapterList.length / itemsPerPage);

  // 点击章节
  const handleChapterClick = (chapterNumber) => {
    if (!novelId) {
      alert('缺少小说ID');
      return;
    }

    if (!chapterNumber) {
      alert('缺少章节ID');
      return;
    }

    const readUrl = getNovelReadPath(novelId, chapterNumber, isCollected);
    window.open(
      readUrl,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className={styles.chapterListContainer}>
      <div className={styles.chapterHeader}>
        <h2 className={styles.sectionTitle}>章节列表</h2>
        <div className={styles.chapterControls}>
          <select
            className={styles.sortSelect}
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value={NEWEST}>倒叙</option>
            <option value={OLDEST}>正序</option>
          </select>
        </div>
      </div>

      <div className={styles.chaptersGrid}>
        {currentPageChapters.length > 0 ? (
          currentPageChapters.map((chapter, index) => (
            <a
              key={chapter.id || `chapter-${index}`}
              href={`#chapter-${chapter.id}`}
              className={styles.chapterItem}
              onClick={(e) => {
                e.preventDefault();
                handleChapterClick(chapter.chapter_number);
              }}
            >
              <div className={styles.chapterInfo}>
                <span className={styles.chapterTitle}>
                  {chapter.chapter_number !== undefined
                    ? `第${chapter.chapter_number}章${chapter.title ? '：' + chapter.title : ''}`
                    : chapter.title || '未知章节'}
                </span>
                <div className={styles.chapterMeta}>
                  {chapter.word_count && (
                    <span className={styles.wordCount}>
                      {chapter.word_count}字
                    </span>
                  )}
                </div>
              </div>
              <i className={`fa fa-angle-right ${styles.chapterArrow}`}></i>
            </a>
          ))
        ) : (
          <div className={styles.noChaptersMessage}>
            当前页面没有章节
          </div>
        )}
      </div>

      {/* 分页组件 */}
      {sortedChapterList.length > itemsPerPage && (
        <Pagination
          totalItems={sortedChapterList.length}
          itemsPerPage={itemsPerPage}
          initialPage={currentPage}
          showInfo={true}
          showJump={true}
          onChange={handlePaginationChange}
          classNames={{
            pagination: 'mt-4',
            wrapper: styles.paginationWrapper
          }}
        />
      )}
    </section>
  );
}