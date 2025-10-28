import React, { useState } from 'react';
import './NovelDetail.css'; // 对应后面的CSS样式

// 小说信息卡片组件
const NovelInfoCard = ({ title, author, coverUrl, tags, stats, intro }) => {
  return (
    <section className="novel-info-container">
      <div className="novel-cover-section">
        <div className="cover-wrapper">
          <img src={coverUrl} alt={title} className="novel-cover" />
          <div className="tag-container">
            {tags.map((tag, index) => (
              <span key={index} className="novel-tag">{tag}</span>
            ))}
          </div>
          <button className="read-btn">开始阅读</button>
          <button className="add-bookshelf-btn">加入书架</button>
        </div>
      </div>

      <div className="novel-detail-section">
        <h1 className="novel-title">{title}</h1>

        <div className="basic-info">
          <span className="info-item">作者：<a href="#" className="author-link">{author}</a></span>
          <span className="info-item">字数：{stats.wordCount}</span>
          <span className="info-item">更新：{stats.updateTime}</span>
          <span className="info-item">人气：{stats.popularity}</span>
          <div className="rating">
            <span className="info-item">评分：</span>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fa ${i < Math.floor(stats.rating) ? 'fa-star' : i < stats.rating ? 'fa-star-half-o' : 'fa-star-o'}`}
                ></i>
              ))}
              <span className="rating-value">{stats.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="intro-card">
          <h2 className="section-title">小说简介</h2>
          <div className="intro-content">
            {intro.split('\n').map((paragraph, index) => (
              <p key={index} className="intro-paragraph">{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">总点击</div>
            <div className="stat-value">{stats.totalClicks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">总推荐</div>
            <div className="stat-value">{stats.totalRecommends}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">章节数</div>
            <div className="stat-value">{stats.chapterCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">周更新</div>
            <div className="stat-value">{stats.weeklyUpdates}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 章节列表组件
const ChapterList = ({ chapters, currentPage, totalPages, onPageChange }) => {
  return (
    <section className="chapter-list-container">
      <div className="chapter-header">
        <h2 className="section-title">章节列表</h2>
        <div className="chapter-controls">
          <select className="sort-select">
            <option>按最新章节</option>
            <option>按最早章节</option>
          </select>
          <div className="view-buttons">
            <button className="view-btn"><i className="fa fa-th-large"></i></button>
            <button className="view-btn"><i className="fa fa-list"></i></button>
          </div>
        </div>
      </div>

      <div className="pagination">
        <button
          className="page-btn prev-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <i className="fa fa-angle-left"></i> 上一页
        </button>

        <div className="page-numbers">
          {[1, 2, 3, '...', totalPages].map((page) => (
            <button
              key={page}
              className={`page-number ${page === currentPage ? 'active' : ''}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={typeof page !== 'number'}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="page-btn next-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          下一页 <i className="fa fa-angle-right"></i>
        </button>
      </div>

      <div className="chapters-grid">
        {chapters.map((chapter, index) => (
          <a
            key={index}
            href={`#chapter-${chapter.id}`}
            className={`chapter-item ${chapter.isNew ? 'new' : chapter.isRead ? 'read' : ''}`}
          >
            <div className="chapter-info">
              {chapter.isNew && <span className="chapter-tag">最新</span>}
              {chapter.isRead && !chapter.isNew && <span className="chapter-tag read-tag">已读</span>}
              <span className="chapter-title">{chapter.title}</span>
            </div>
            <i className="fa fa-angle-right chapter-arrow"></i>
          </a>
        ))}
      </div>
    </section>
  );
};

// 推荐小说组件
const RecommendedNovels = ({ recommendations }) => {
  return (
    <section className="recommendations-container">
      <h2 className="section-title">同类推荐</h2>
      <div className="recommendations-grid">
        {recommendations.map((novel, index) => (
          <a key={index} href={`#novel-${novel.id}`} className="recommend-item">
            <div className="recommend-cover-wrapper">
              <img src={novel.coverUrl} alt={novel.title} className="recommend-cover" />
            </div>
            <h3 className="recommend-title">{novel.title}</h3>
            <p className="recommend-author">{novel.author}</p>
            <div className="recommend-rating">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fa ${i < Math.floor(novel.rating) ? 'fa-star' : i < novel.rating ? 'fa-star-half-o' : 'fa-star-o'}`}
                ></i>
              ))}
              <span className="recommend-rating-value">{novel.rating.toFixed(1)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

// 主组件
const NovelDetailPage = () => {
  // 状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12; // 总页数

  // 模拟小说数据
  const novelData = {
    title: "星辰变",
    author: "我吃西红柿",
    coverUrl: "https://picsum.photos/600/800",
    tags: ["玄幻", "修仙", "连载中"],
    stats: {
      wordCount: "328.5万字",
      updateTime: "2023-10-25",
      popularity: "987.2万",
      rating: 4.8,
      totalClicks: "12,589,741",
      totalRecommends: "897,562",
      chapterCount: "1,256",
      weeklyUpdates: "12章"
    },
    intro: "一名孩童，天生无法修炼内功。为了得到父亲的重视关注，他毅然选择了修炼最痛苦艰难的外功。春去秋来，少年毅然坚持，从不放弃。他一点点的进步，一步步的踏入武道的世界，最终成就了一段传奇。\n\n这是一个传奇的世界，有修真者飞天遁地，有妖族横行霸道，有魔族诡异莫测。而我们的主角，从一个平凡的少年，凭借着自己的毅力和奇遇，一步步踏上巅峰，揭开了宇宙的奥秘，成为了永恒的存在。"
  };

  // 模拟章节数据
  const chapterData = [
    { id: 1256, title: "第1256章 宇宙之主", isNew: true, isRead: false },
    { id: 1255, title: "第1255章 鸿蒙初开", isNew: false, isRead: true },
    { id: 1254, title: "第1254章 星辰之力", isNew: false, isRead: false },
    { id: 1253, title: "第1253章 修炼突破", isNew: false, isRead: false },
    { id: 1252, title: "第1252章 秘境探险", isNew: false, isRead: false },
    { id: 1251, title: "第1251章 遭遇强敌", isNew: false, isRead: false },
    { id: 1250, title: "第1250章 宗门大比", isNew: false, isRead: false },
    { id: 1249, title: "第1249章 新的征程", isNew: false, isRead: false },
    { id: 1248, title: "第1248章 离别之际", isNew: false, isRead: false }
  ];

  // 模拟推荐小说数据
  const recommendedNovels = [
    {
      id: 1,
      title: "盘龙",
      author: "我吃西红柿",
      coverUrl: "https://picsum.photos/400/500?random=1",
      rating: 4.0
    },
    {
      id: 2,
      title: "斗破苍穹",
      author: "天蚕土豆",
      coverUrl: "https://picsum.photos/400/500?random=2",
      rating: 4.5
    },
    {
      id: 3,
      title: "斗罗大陆",
      author: "唐家三少",
      coverUrl: "https://picsum.photos/400/500?random=3",
      rating: 5.0
    },
    {
      id: 4,
      title: "凡人修仙传",
      author: "忘语",
      coverUrl: "https://picsum.photos/400/500?random=4",
      rating: 4.2
    }
  ];

  return (
    <div className="novel-detail-page">
      {/* 面包屑导航 */}
      <div className="breadcrumb">
        <a href="#" className="breadcrumb-link">首页</a>
        <span className="breadcrumb-separator">/</span>
        <a href="#" className="breadcrumb-link">玄幻小说</a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{novelData.title}</span>
      </div>

      {/* 小说信息 */}
      <NovelInfoCard {...novelData} />

      {/* 章节列表 */}
      <ChapterList
        chapters={chapterData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 推荐小说 */}
      <RecommendedNovels recommendations={recommendedNovels} />

      {/* 阅读悬浮按钮 */}
      <a href="#" className="floating-read-btn">
        <i className="fa fa-book"></i>
      </a>
    </div>
  );
};

export default NovelDetailPage;