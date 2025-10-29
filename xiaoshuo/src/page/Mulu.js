import React, { useState } from 'react';
import styles from './Mulu.module.css'

// 小说信息卡片组件
const NovelInfoCard = ({ title, author, coverUrl, tags, stats, intro }) => {
  return (
    <section className={styles.novelInfoContainer}>
      <div className="novel-cover-section">
        <div className={styles.coverWrapper}>
          <img src={coverUrl} alt={title} className={styles.novelCover} />
          <div className={styles.tagContainer}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.novelTag}>{tag}</span>
            ))}
          </div>
          <button className={styles.readBtn}>开始阅读</button>
          <button className={styles.addBookshelfBtn}>加入书架</button>
        </div>
      </div>

      <div className="novel-detail-section">
        <h1 className={styles.novelTitle}>{title}</h1>

        <div className={styles.basicInfo}>
          <span className={styles.infoItem}>作者：<a href="#" className={styles.authorLink}>{author}</a></span>
          <span className={styles.infoItem}>字数：{stats.wordCount}</span>
          <span className={styles.infoItem}>更新：{stats.updateTime}</span>
          <span className={styles.infoItem}>人气：{stats.popularity}</span>
          <div className={styles.rating}>
            <span className={styles.infoItem}>评分：</span>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fa ${i < Math.floor(stats.rating) ? 'fa-star' : i < stats.rating ? 'fa-star-half-o' : 'fa-star-o'}`}
                ></i>
              ))}
              <span className={styles.ratingValue}>{stats.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className={styles.introCard}>
          <h2 className={styles.sectionTitle}>小说简介</h2>
          <div className={styles.introContent}>
            {intro.split('\n').map((paragraph, index) => (
              <p key={index} className={styles.introParagraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>总点击</div>
            <div className={styles.statValue}>{stats.totalClicks}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>总推荐</div>
            <div className={styles.statValue}>{stats.totalRecommends}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>章节数</div>
            <div className={styles.statValue}>{stats.chapterCount}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>周更新</div>
            <div className={styles.statValue}>{stats.weeklyUpdates}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
// 章节列表组件
const ChapterList = ({ chapters, currentPage, totalPages, onPageChange }) => {
  return (
    <section className={styles.chapterListContainer}>
      <div className={styles.chapterHeader}>
        <h2 className={styles.sectionTitle}>章节列表</h2>
        <div className={styles.chapterControls}>
          <select className={styles.sortSelect}>
            <option>按最新章节</option>
            <option>按最早章节</option>
          </select>
          <div className={styles.viewButtons}>
            <button className={styles.viewBtn}><i className="fa fa-th-large"></i></button>
            <button className={styles.viewBtn}><i className="fa fa-list"></i></button>
          </div>
        </div>
      </div>

      <div className={styles.chaptersGrid}>
        {chapters.map((chapter, index) => (
          <a
            key={index}
            href={`#chapter-${chapter.id}`}
            className={`${styles.chapterItem} ${chapter.isNew ? 'new' : chapter.isRead ? 'read' : ''}`}
          >
            <div className={styles.chapterInfo}>
              {chapter.isNew && <span className={styles.chapterTag}>最新</span>}
              {chapter.isRead && !chapter.isNew && <span className="chapter-tag read-tag">已读</span>}
              <span className="chapter-title">{chapter.title}</span>
            </div>
            <i className={`fa fa-angle-right ${styles.chapterArrow}`}></i>
          </a>
        ))}
      </div>
    </section>
  );
};
// 推荐小说组件
const RecommendedNovels = ({ recommendations }) => {
  return (
    <section className={styles.recommendationsContainer}>
      <h2 className={styles.sectionTitle}>同类推荐</h2>
      <div className={styles.recommendationsGrid}>
        {recommendations.map((novel, index) => (
          <a key={index} href={`#novel-${novel.id}`} className={styles.recommendItem}>
            <div className={styles.recommendCoverWrapper}>
              <img src={novel.coverUrl} alt={novel.title} className={styles.recommendCover} />
            </div>
            <h3 className={styles.recommendTitle}>{novel.title}</h3>
            <p className={styles.recommendAuthor}>{novel.author}</p>
            <div className={styles.recommendRating}>
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fa ${i < Math.floor(novel.rating) ? 'fa-star' : i < novel.rating ? 'fa-star-half-o' : 'fa-star-o'}`}
                ></i>
              ))}
              <span className={styles.recommendRatingValue}>{novel.rating.toFixed(1)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default function Mulu() {
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
    <div className={styles.novelDetailPage}>
      {/* 面包屑导航 */}
      <div className={styles.breadcrumb}>
        <a href="#" className={styles.breadcrumbLink}>首页</a>
        <span className={styles.breadcrumbSeparator}>/</span>
        <a href="#" className={styles.breadcrumbLink}>玄幻小说</a>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{novelData.title}</span>
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
      <a href="#" className={styles.floatingReadBtn}>
        <i className="fa fa-book"></i>
      </a>
    </div>
  );
}