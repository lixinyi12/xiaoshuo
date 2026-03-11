import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { novelApi, userApi } from '../../api';
import styles from './NovelRead.module.css';
import { IS_LOGIN, NOVEL_READER_SETTINGS } from '../../constants';
import { ROUTES } from '../../constants/link';

/**
 * 小说阅读器组件
 * 提供小说章节阅读、设置调整、书签管理等功能
 * 使用分开的API接口：一个获取章节列表，一个获取特定章节内容
 */
const NovelRead = () => {
  const [searchParams] = useSearchParams();
  const novelId = Number(searchParams.get('novelId'));
  const chapterNumber = searchParams.get('chapterNumber');
  const navigate = useNavigate();

  // 状态管理
  const [currentChapter, setCurrentChapter] = useState(null); // 当前章节数据
  const [chapterList, setChapterList] = useState([]); // 章节列表
  const [fontSize, setFontSize] = useState(16); // 字体大小
  const [isDarkMode, setIsDarkMode] = useState(false); // 是否夜间模式
  const [bookmarks, setBookmarks] = useState([]); // 书签列表
  const [showSettings, setShowSettings] = useState(false); // 是否显示设置面板
  const [showChapterList, setShowChapterList] = useState(false); // 是否显示章节列表
  const [readingProgress, setReadingProgress] = useState(0); // 当前章节阅读进度
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误信息
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(false);

  const contentRef = useRef(null);

  // 获取章节列表
  const fetchChapterList = async () => {
    try {
      const res = await novelApi.getChapterList({ id: novelId });
      if (res.data.status === 200) {
        const chapters = Array.isArray(res.data.data) ? res.data.data : [];
        setChapterList(chapters);
        return chapters;
      } else {
        setError(res.data.msg || '获取章节列表失败');
        return [];
      }
    } catch (error) {
      console.error('获取章节列表失败：', error);
      setError('网络错误，请稍后重试');
      return [];
    }
  };

  // 获取特定章节内容
  const fetchChapterContent = async (targetChapterNumber) => {
    try {
      setLoading(true);
      const res = await novelApi.getNovelContent({
        novelId,
        chapterNumber: targetChapterNumber
      });

      if (res.data.status === 200) {
        setCurrentChapter(res.data.data);

        // 更新URL中的chapterNumber
        const params = new URLSearchParams(searchParams);
        params.set('chapterNumber', targetChapterNumber);
        navigate(`?${params.toString()}`, { replace: true });

        // 重置阅读进度
        setReadingProgress(0);

        // 滚动到顶部
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }

        setError(null);
      } else if (res.data.status === 404) {
        setError('章节不存在');
      } else {
        setError(res.data.msg || '获取章节内容失败');
      }
    } catch (error) {
      console.error('获取章节内容失败：', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // 先获取章节列表
      const chapters = await fetchChapterList();

      if (chapters.length > 0) {
        // 如果有URL参数中的章节编号，使用它
        if (chapterNumber) {
          const targetChapter = chapters.find(
            ch => ch.chapter_number.toString() === chapterNumber.toString()
          );
          if (targetChapter) {
            await fetchChapterContent(chapterNumber);
          } else {
            // 如果没有找到指定章节，获取第一章
            await fetchChapterContent(1);
          }
        } else {
          // 如果没有指定章节，获取第一章
          await fetchChapterContent(1);
        }
      } else {
        setLoading(false);
      }
    };

    if (novelId) {
      init();
    }
  }, [novelId]);

  // 从localStorage加载阅读设置
  useEffect(() => {
    const savedSettings = sessionStorage.getItem('novelReaderSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFontSize(settings.fontSize || 16);
      setIsDarkMode(settings.isDarkMode || false);
      setBookmarks(settings.bookmarks || []);
    }
  }, [novelId]);

  // 保存设置到localStorage
  useEffect(() => {
    const settings = {
      fontSize,
      isDarkMode,
      bookmarks
    };
    sessionStorage.setItem(NOVEL_READER_SETTINGS, JSON.stringify(settings));
  }, [fontSize, isDarkMode, bookmarks]);

  // 检查收藏状态
  const checkFavoriteStatus = async () => {
    const isLogin = sessionStorage.getItem(IS_LOGIN);
    if (!isLogin) {
      setIsFavorite(false);
      return;
    }
    try {
      setCheckingFavorite(true);
      const res = await userApi.checkCollected({novelId});
      if (res.data.status === 200) {
        setIsFavorite(res.data.collected);
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      console.error('检查收藏状态失败：', error);
      setIsFavorite(false);
    } finally {
      setCheckingFavorite(false);
    }
  };

  // 在组件加载或 novelId 变化时重新检查收藏状态
  useEffect(() => {
    if (novelId) {
      checkFavoriteStatus();
    }
  }, [novelId]);

  // 切换收藏按钮状态
  const toggleBookmark = async () => {
    const isLogin = sessionStorage.getItem(IS_LOGIN);
    if (!isLogin) {
      const currentUrl = window.location.pathname + window.location.search;
      navigate(`${ROUTES.SIGNIN}?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    try {
      const res = await userApi.addToShelf({ novelId });
      if (res.data.status === 200) {
        await checkFavoriteStatus();
      } else {
        console.error('切换收藏失败', res.data.msg);
      }
    } catch (error) {
      console.error('切换收藏失败：', error);
    }
  };

  // 切换到下一个章节
  const goToNextChapter = async () => {
    if (!currentChapter) return;

    const currentChapterNum = parseInt(currentChapter.chapterNumber);
    const nextChapterNum = currentChapterNum + 1;

    // 检查下一章是否存在
    const nextChapter = chapterList.find(ch =>
      parseInt(ch.chapter_number) === nextChapterNum
    );

    if (nextChapter) {
      await fetchChapterContent(nextChapterNum);
    } else {
      alert('已经是最后一章了');
    }
  };

  // 切换到上一个章节
  const goToPrevChapter = async () => {
    if (!currentChapter) return;

    const currentChapterNum = parseInt(currentChapter.chapterNumber);
    const prevChapterNum = currentChapterNum - 1;

    if (prevChapterNum >= 1) {
      // 检查上一章是否存在
      const prevChapter = chapterList.find(ch =>
        parseInt(ch.chapter_number) === prevChapterNum
      );

      if (prevChapter) {
        await fetchChapterContent(prevChapterNum);
      } else {
        alert('已经是第一章了');
      }
    } else {
      alert('已经是第一章了');
    }
  };

  // 点击章节列表中的章节
  const handleChapterClick = async (chapterNumber) => {
    await fetchChapterContent(chapterNumber);
    setShowChapterList(false);
  };

  // 调整字体大小
  const adjustFontSize = (delta) => {
    const newSize = Math.min(Math.max(fontSize + delta, 12), 24);
    setFontSize(newSize);
  };

  // 加载中状态
  if (loading && !currentChapter) {
    return <div className="loading">加载章节中...</div>;
  }

  // 错误状态
  if (error && !currentChapter) {
    return <div className="error">{error}</div>;
  }

  // 无章节数据时
  if (!currentChapter && chapterList.length === 0) {
    return <div className="no-data">暂无章节内容</div>;
  }

  return (
    <div className={`${styles.novelReader} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* 顶部导航栏 */}
      <header className={styles.readerHeader}>
        <button
          className={styles.menuButton}
          onClick={() => setShowChapterList(!showChapterList)}
        >
          目录
        </button>
        <div className={styles.headerButtons}>
          <button
            className={`${styles.bookmarkButton} ${isFavorite ? styles.active : ''}`}
            onClick={toggleBookmark}
            disabled={checkingFavorite}
          >
            {isFavorite ? '已收藏' : '收藏'}
          </button>
          <button
            className={styles.settingsButton}
            onClick={() => setShowSettings(!showSettings)}
          >
            设置
          </button>
        </div>
      </header>

      {/* 章节列表 */}
      {showChapterList && (
        <div className={styles.chapterList}>
          <h3>章节目录（共{chapterList.length}章）</h3>
          <ul>
            {chapterList.map((chapter) => (
              <li
                key={chapter.id}
                className={`${currentChapter?.chapterNumber === chapter.chapter_number.toString() ? styles.active : ''}`}
                onClick={() => handleChapterClick(chapter.chapter_number)}
              >
                第{chapter.chapter_number}章：{chapter.title}
                {bookmarks.includes(chapter.id) && (
                  <span className={styles.bookmarkIcon}>★</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 设置面板 */}
      {showSettings && (
        <div className={styles.settingsPanel}>
          <h3>阅读设置</h3>
          <div className={styles.settingItem}>
            <label>字体大小</label>
            <div className={styles.fontSizeControls}>
              <button onClick={() => adjustFontSize(-2)}>-</button>
              <span>{fontSize}px</span>
              <button onClick={() => adjustFontSize(2)}>+</button>
            </div>
          </div>
          <div className={styles.settingItem}>
            <label>主题模式</label>
            <button
              className={`${styles.themeToggle} ${isDarkMode ? styles.dark : styles.light}`}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? '夜间模式' : '日间模式'}
            </button>
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <main
        className={styles.readerContent}
        style={{ fontSize: `${fontSize}px` }}
        ref={contentRef}
      >
        {currentChapter && (
          <div className={styles.chapterContent}>
            <div className={styles.chapterHeader}>
              <h1>第{currentChapter.chapterNumber}章：{currentChapter.title}</h1>
              <div className={styles.chapterMeta}>
                {currentChapter.wordCount && (
                  <span>字数：{currentChapter.wordCount}</span>
                )}
                {currentChapter.viewCount !== undefined && (
                  <span>阅读：{currentChapter.viewCount}</span>
                )}
                {currentChapter.updatedAt && (
                  <span>更新：{new Date(currentChapter.updatedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            <div className={styles.contentText}>
              {currentChapter.content ? (
                <div dangerouslySetInnerHTML={{ __html: currentChapter.content.replace(/\n/g, '<br/>') }} />
              ) : (
                '本章节暂无内容'
              )}
            </div>
          </div>
        )}
      </main>

      {/* 底部导航 */}
      <footer className={styles.readerFooter}>
        <button
          className={styles.navButton}
          disabled={!currentChapter || parseInt(currentChapter.chapterNumber) <= 1}
          onClick={goToPrevChapter}
        >
          上一章
        </button>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${readingProgress}%` }}
            />
          </div>
          <div className={styles.progressText}>
          </div>
        </div>
        <button
          className={styles.navButton}
          disabled={!currentChapter || !chapterList.find(ch =>
            parseInt(ch.chapter_number) === parseInt(currentChapter.chapterNumber) + 1
          )}
          onClick={goToNextChapter}
        >
          下一章
        </button>
      </footer>
    </div>
  );
};

export default NovelRead;