import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../components/NovelReader.css';

const NovelRead = () => {
  const { novelId } = useParams();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // 示例章节数据
  const chapters = [
    {
      id: 1,
      title: "第一章：开始",
      content: "这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容.这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容...这是第一章的内容..."
    },
    {
      id: 2,
      title: "第二章：发展",
      content: "这是第二章的内容..."
    },
    // 更多章节...
  ];

  // 从localStorage加载数据
  useEffect(() => {
    const savedSettings = localStorage.getItem('novelReaderSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFontSize(settings.fontSize || 16);
      setIsDarkMode(settings.isDarkMode || false);
      setBookmarks(settings.bookmarks || []);
    }

    const savedProgress = localStorage.getItem(`novelProgress_${novelId}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentChapter(progress.chapter || 0);
      setReadingProgress(progress.progress || 0);
    }
  }, [novelId]);

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
    const progress = {
      chapter: currentChapter,
      progress: readingProgress
    };
    localStorage.setItem(`novelProgress_${novelId}`, JSON.stringify(progress));
  }, [currentChapter, readingProgress, novelId]);

  // 处理滚动事件
  const handleScroll = (e) => {
    const element = e.target;
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setReadingProgress(Math.round(scrollPercentage));
  };

  // 切换书签
  const toggleBookmark = () => {
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
          <h3>章节目录</h3>
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
