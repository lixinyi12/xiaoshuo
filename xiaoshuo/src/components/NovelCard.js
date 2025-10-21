import styles from "./NovelCard.module.css";

export default function NovelCard({ novel }) {
  return (
    <div className="col-12 mb-4">
      <div className={styles.novelCard}>
        <div className={styles.novelCover}>{novel.cover}</div>
        <div className={styles.novelMeta}>
          <h3 className={styles.novelTitle}>{novel.title}</h3>
          <div className={styles.novelAuthor}>作者：{novel.author}</div>
          <div className={styles.novelStats}>
            <span>{novel.stats?.[0] || '暂无数据'}</span>
            <span>{novel.stats?.[1] || '暂无数据'}</span>
            <span>{novel.stats?.[2] || '暂无数据'}</span>
          </div>
          {(novel.tag || []).map((element, index) => (
            <span key={index} className={styles.novelTag}>
              {element}
            </span>
          ))}
        </div>
        <p className={styles.novelDesc}>{novel.desc}</p>
      </div>
    </div>
  );
}
