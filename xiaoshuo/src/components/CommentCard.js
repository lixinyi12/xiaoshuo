import styles from "./CommentCard.module.css";
import api from "../api";
import { useState, useEffect } from "react";

/**
 * @param {comment} param0 
 *  {
 *    id: 评论id,
 *    avatar: 用户头像URL,
 *    nickname: 用户昵称,
 *    content: 评论内容,
 *    novel: 评论的小说名称,
 *    time: 评论时间,
 *    stats: [
 *        `👍 ${item.likes}`,
 *        `💬 ${item.replies}`
 *    ],
 *    parentAuthor: 父评论作者昵称
 *  }
 */

function ChildCard ({comment = {}}){
  const {
    nickname = "匿名用户",
    content = "暂无评论内容",
    time = "未知时间",
    parentAuthor = null
  } = comment;

  return (
    <div className="col-12 mb-3">
      <div className={styles.childCardWrapper}>
        <div className={styles.commentHeader}>
          <div className={styles.userInfo}>
            <div className={styles.userBasicInfo}>
              <h4 className={styles.userNickname}>{nickname}</h4>

            </div>
            <div className={styles.commentTime}>{time}</div>
          </div>
        </div>
        <div className={styles.commentContent}>
          {parentAuthor && (
            <span>回复@{parentAuthor}:</span>
          )}
          <span>{content}</span>
        </div>
        <div className={styles.commentFooter}>
          <div className={styles.commentStats}>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommentCard({ comment = {} }) {
  const {
    avatar = "默认头像",
    nickname = "匿名用户",
    content = "暂无评论内容",
    novel = "未知小说",
    time = "未知时间",
    stats = [],
    parentAuthor = null
  } = comment;

  const safeStats = [
    stats?.[0] || "👍 0",
    stats?.[1] || "💬 0"
  ];
  const [childComments, setChildComments] = useState({})
  const [showChildComments,setShowChildComments] = useState({})
  useEffect(() => {
    api.childComments({ parentId: comment.id }).then(res => {
      setChildComments(pre=>({
        ...pre,
        [comment.id]:res.data.result
      }))
    })
  }, [])
  function commentsClick(){
    setShowChildComments(pre=>({
      ...pre,
      [comment.id]:!showChildComments[comment.id]
    }))
  }

  return (
    <>
      <div className="col-12 mb-3">
        <div className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <div className={styles.userAvatar}>
              {avatar === "默认头像" ? (
                <div className={styles.defaultAvatar}>
                  {nickname.charAt(0)}
                </div>
              ) : (
                <img src={avatar} alt={nickname} className={styles.avatarImg} />
              )}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userBasicInfo}>
                <h4 className={styles.userNickname}>{nickname}</h4>

              </div>
              <div className={styles.commentNovel}>评论了《{novel}》</div>
              <div className={styles.commentTime}>{time}</div>
            </div>
          </div>
          <div className={styles.commentContent}>
            {parentAuthor && (
              <span>回复@{parentAuthor}:</span>
            )}
            <span>{content}</span>
          </div>
          <div className={styles.commentFooter}>
            <div className={styles.commentStats}>
              <span className={styles.statItem}>
                {safeStats[0]}
              </span>
              <span
                className={styles.statItem}
                style={{ cursor: "pointer" }}
                onClick={commentsClick}
                data-bs-toggle="collapse"
                data-bs-target={`#childComments${comment.id}`}
                aria-expanded={showChildComments[comment.id] ? "true" : "false"}
              >
                {safeStats[1]}
              </span>
            </div>
          </div>

          <div
            className="collapse"
            id={`childComments${comment.id}`}
          >
            {childComments[comment.id]?.map((child, index) => (
              <ChildCard key={index} comment={child} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}