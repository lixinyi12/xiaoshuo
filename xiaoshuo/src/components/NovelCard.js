import styles from "./NovelCard.module.css";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useContext } from "react";
import { getMuluPath, getWorksManagementPath, ROUTES } from "../constants/link";

/**
 * @param {novel} param0 
 *  {
 *    id: item.id,
 *    cover: item.cover,
 *    title: item.title,
 *    author: item.author,
 *    authorId: item.authorId,        // 新增：作者ID，用于身份比对
 *    stats: [
 *        `🔥 ${(item.hot / 10000).toFixed(1)}万`,
 *        `📖 ${item.chapters}章`,
 *        `⭐ ${item.average_score}评分`
 *    ],
 *    tag: item.tags ? item.tags.split(",") : [],
 *    desc: item.description,
 *  }
 */
export default function NovelCard({ novel = {} }) {
  const location = useLocation();
  const isManagePage = location.pathname.startsWith(ROUTES.WORKS);

  const {
    cover = "暂无封面",
    title = "暂无标题",
    author = "未知作者",
    stats = [],
    tag = [],
    desc = "暂无简介",
  } = novel;

  // 给 stats 设置默认值，保证长度为3
  const safeStats = [
    stats?.[0] || "🔥 暂无数据",
    stats?.[1] || "📖 暂无数据",
    stats?.[2] || "⭐ 暂无数据",
  ];

  // tag 也保证是数组
  const safeTag = Array.isArray(tag) ? tag : [];

  return (
    <div className="col-12 mb-4">
      <div className={styles.novelCard}>
        <div className={styles.novelCover}>{cover || "暂无封面"}</div>
        <div className={styles.novelMeta}>
          <h3 className={styles.novelTitle}>{title}</h3>
          <div className={styles.novelAuthor}>作者：{author}</div>
          <div className={styles.novelStats}>
            <span>{safeStats[0]}</span>
            <span>{safeStats[1]}</span>
            <span>{safeStats[2]}</span>
          </div>
          {safeTag.length > 0
            ? safeTag.map((element, index) => (
              <span key={index} className={styles.novelTag}>
                {element || "标签未知"}
              </span>
            ))
            : <span className={styles.novelTag}>暂无标签</span>
          }
        </div>
        <p className={styles.novelDesc}>{desc || "暂无简介"}</p>

        {/* 操作按钮区域 */}
        <div className={styles.cardActions}>
          {isManagePage ?
            <NavLink
              className={styles.startReadingButton}
              to={getWorksManagementPath(novel.id)}
              target="_blank"
              end>
              编辑
            </NavLink>
            :
            <NavLink
              className={styles.startReadingButton}
              to={getMuluPath(novel.id)}
              target="_blank"
              end>
              开始阅读
            </NavLink>
          }

        </div>
      </div>
    </div>
  );
}