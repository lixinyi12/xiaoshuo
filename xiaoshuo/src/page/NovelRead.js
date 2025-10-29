import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'; // 引入API配置
import '../components/NovelReader.css';

const NovelRead = () => {
  const { novelId: routeNovelId } = useParams(); // 从路由获取小说ID
  // 默认使用1001，如果路由有传值则优先使用路由的ID
  const novelId = routeNovelId || '1001';

  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [chapters, setChapters] = useState([]); // 存储从数据库获取的章节数据
  const [loading, setLoading] = useState(true); // 加载状态

  // 从数据库获取章节内容（默认用1001）
  useEffect(() => {

    // 修改后
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const res = await api.getNovelContent({ novelId: novelId });
        console.log(res)
        if (res.status === 200) {
          // 确保设置的是一个数组，如果 res.thisnovelcontent 不是数组，则设置为空数组
          setChapters(Array.isArray(res.thisnovelcontent) ? res.thisnovelcontent : []);
        } else {
          // 如果API响应状态不是200，也设置为空数组
          setChapters([]);
        }
      } catch (error) {
        console.error('获取章节失败：', error);
        // 发生错误时，设置chapters为空数组
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [novelId]); // 当小说ID变化时重新加载（默认1001，路由有值时会更新）

  // 从localStorage加载数据
  useEffect(() => {
    const savedSettings = localStorage.getItem('novelReaderSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFontSize(settings.fontSize || 16);
      setIsDarkMode(settings.isDarkMode || false);
      setBookmarks(settings.bookmarks || []);
    }
  }, [novelId]); // 只依赖 novelId

  // 新增一个 useEffect，在 chapters 更新后处理 savedProgress
  useEffect(() => {
    if (chapters.length > 0) {
      const savedProgress = localStorage.getItem(`novelProgress_${novelId}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCurrentChapter(Math.min(progress.chapter || 0, chapters.length - 1));
        setReadingProgress(progress.progress || 0);
      }
    }
  }, [novelId, chapters]); // 依赖 chapters，当 chapters 更新时执行

  // 保存设置到localStorage
  useEffect(() => {
    const settings = {
      fontSize,
      isDarkMode,
      bookmarks
    };
    localStorage.setItem('novelReaderSettings', JSON.stringify(settings));
  }, [fontSize, isDarkMode, bookmarks]);

  // 保存阅读进度
  useEffect(() => {
    if (chapters.length > 0) {
      const progress = {
        chapter: currentChapter,
        progress: readingProgress
      };
      localStorage.setItem(`novelProgress_${novelId}`, JSON.stringify(progress));
    }
  }, [currentChapter, readingProgress, novelId, chapters.length]);

  // 处理滚动事件
  const handleScroll = (e) => {
    const element = e.target;
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setReadingProgress(Math.round(scrollPercentage));
  };

  // 切换书签
  const toggleBookmark = () => {
    if (chapters.length === 0) return;
    const chapterId = chapters[currentChapter].id;
    if (bookmarks.includes(chapterId)) {
      setBookmarks(bookmarks.filter(id => id !== chapterId));
    } else {
      setBookmarks([...bookmarks, chapterId]);
    }
  };

  // 切换章节
  const changeChapter = (index) => {
    setCurrentChapter(index);
    setReadingProgress(0);
    setShowChapterList(false);
  };

  // 调整字体大小
  const adjustFontSize = (delta) => {
    const newSize = Math.min(Math.max(fontSize + delta, 12), 24);
    setFontSize(newSize);
  };

  // 加载中状态
  if (loading) {
    return <div className="loading">加载章节中...</div>;
  }

  // 无章节数据时
  if (chapters.length === 0) {
    return <div className="no-data">暂无小说ID为 {novelId} 的章节内容</div>;
  }

  return (
    <div className={`novel-reader ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* 顶部导航栏 */}
      <header className="reader-header">
        <button
          className="menu-button"
          onClick={() => setShowChapterList(!showChapterList)}
        >
          目录
        </button>
        <h2 className="chapter-title">{chapters[currentChapter].title}</h2>
        <div className="header-buttons">
          <button
            className={`bookmark-button ${bookmarks.includes(chapters[currentChapter].id) ? 'active' : ''}`}
            onClick={toggleBookmark}
          >
            {bookmarks.includes(chapters[currentChapter].id) ? '已收藏' : '收藏'}
          </button>
          <button
            className="settings-button"
            onClick={() => setShowSettings(!showSettings)}
          >
            设置
          </button>
        </div>
      </header>

      {/* 章节列表 */}
      {showChapterList && (
        <div className="chapter-list">
          <h3>章节目录（小说ID：{novelId}）</h3>
          <ul>
            {chapters.map((chapter, index) => (
              <li
                key={chapter.id}
                className={index === currentChapter ? 'active' : ''}
                onClick={() => changeChapter(index)}
              >
                {chapter.title}
                {bookmarks.includes(chapter.id) && <span className="bookmark-icon">★</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 设置面板 */}
      {showSettings && (
        <div className="settings-panel">
          <h3>阅读设置</h3>
          <div className="setting-item">
            <label>字体大小</label>
            <div className="font-size-controls">
              <button onClick={() => adjustFontSize(-2)}>-</button>
              <span>{fontSize}px</span>
              <button onClick={() => adjustFontSize(2)}>+</button>
            </div>
          </div>
          <div className="setting-item">
            <label>主题模式</label>
            <button
              className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? '夜间模式' : '日间模式'}
            </button>
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <main
        className="reader-content"
        style={{ fontSize: `${fontSize}px` }}
        onScroll={handleScroll}
      >
        <div className="chapter-content">
          {chapters[currentChapter].content}
        </div>
      </main>

      {/* 底部导航 */}
      <footer className="reader-footer">
        <button
          className="nav-button"
          disabled={currentChapter === 0}
          onClick={() => changeChapter(currentChapter - 1)}
        >
          上一章
        </button>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
        <button
          className="nav-button"
          disabled={currentChapter === chapters.length - 1}
          onClick={() => changeChapter(currentChapter + 1)}
        >
          下一章
        </button>
      </footer>
    </div>
  );
};

export default NovelRead;