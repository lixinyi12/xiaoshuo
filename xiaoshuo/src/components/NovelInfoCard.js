import styles from './NovelInfoCard.module.css'
import useAddToShelf from '../hooks/useAddToShelf'
import { getNovelReadPath } from '../constants/link';

export default function NovelInfoCard({
    title,
    author,
    tags,
    stats,
    description,
    cover,
    isCollected,
    id: novelId,
    onCollectChange }) {
    const handleAddToShelf = useAddToShelf();

    const handleStartRead = (novelId) => {
        window.open(getNovelReadPath(novelId, 1, isCollected), '_blank');
    }

    return (
        <section className={styles.novelInfoContainer}>
            <div className="novel-cover-section">
                <div className={styles.coverWrapper}>
                    <img src={cover} alt={title} className={styles.novelCover} />
                    <div className={styles.tagContainer}>
                        {tags.map((tag, index) => (
                            <span key={index} className={styles.novelTag}>{tag}</span>
                        ))}
                    </div>
                    <button className={styles.readBtn} onClick={() => handleStartRead(novelId)}>开始阅读</button>
                    <button className={styles.addBookshelfBtn} onClick={() => handleAddToShelf(novelId, onCollectChange)}>
                        {isCollected ?
                            '移出书架' :
                            '加入书架'}
                    </button>
                </div>
            </div>

            <div className="novel-detail-section">
                <h1 className={styles.novelTitle}>{title}</h1>

                <div className={styles.basicInfo}>
                    <span className={styles.infoItem}>作者：<a href="#" className={styles.authorLink}>{author}</a></span>
                    <span className={styles.infoItem}>字数：{stats.wordCount}</span>
                    <span className={styles.infoItem}>更新：{stats.updateTime}</span>
                    <span className={styles.infoItem}>人气：{stats.hot}</span>
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
                        {description.split('\n').map((paragraph, index) => (
                            <p key={index} className={styles.introParagraph}>{paragraph}</p>
                        ))}
                    </div>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>评论数</div>
                        <div className={styles.statValue}>{stats.totalRecommends}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>章节数</div>
                        <div className={styles.statValue}>{stats.chapterCount}</div>
                    </div>
                </div>
            </div>
        </section>
    );
};