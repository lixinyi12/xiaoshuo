import styles from "./CommentCard.module.css";
import api from "../api";
import { useState, useEffect } from "react";
import { TOKEN } from "../constants";
import { decodeToken } from '../utils/token'

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

function ChildCard({
  comment = {},
  replyVisible,
  replyContent,
  onReplyClick,
  onReplyChange,
  onReplySubmit
}) {
  const {
    id,
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
          {/* 回复按钮 */}
          <span
            className={styles.statItem}
            style={{ cursor: "pointer" }}
            onClick={() => onReplyClick(id)}
          >
            回复
          </span>
        </div>
        {/* 回复输入框 */}
        {replyVisible[id] && (
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="写下你的回复..."
              value={replyContent[id] || ''}
              onChange={(e) => onReplyChange(id, e.target.value)}
              style={{ flex: 1, padding: '4px 8px' }}
              className={styles.replyInput}
            />
            <button
              onClick={() => onReplySubmit(id)}
              className={styles.replyButton}
            >
              发送
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CommentCard({ comment = {} }) {
  console.log(comment)
  const {
    id,
    novelId,
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
  const [showChildComments, setShowChildComments] = useState({})
  const [replyVisible, setReplyVisible] = useState({});
  const [replyContent, setReplyContent] = useState({});
  const token = localStorage.getItem(TOKEN)
  const { uid } = decodeToken(token);

  useEffect(() => {
    api.childComments({ parentId: comment.id }).then(res => {
      setChildComments(pre => ({
        ...pre,
        [comment.id]: res.data.result
      }))
    })
  }, [])

  function commentsClick() {
    setShowChildComments(pre => ({
      ...pre,
      [comment.id]: !showChildComments[comment.id]
    }))
  }

  // 回复
  const handleReplyClick = (commentId) => {
    setReplyVisible(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    // 如果关闭输入框，清空内容
    if (replyVisible[commentId]) {
      setReplyContent(prev => ({ ...prev, [commentId]: '' }));
    }
  };

  const handleReplyChange = (commentId, value) => {
    setReplyContent(prev => ({ ...prev, [commentId]: value }));
  };

  const handleReplySubmit = async (commentId) => {
    const contentText = replyContent[commentId];
    if (!contentText || !contentText.trim()) return;
    try {
      await api.addComment({
        userId: uid,
        novelId,
        parentId: commentId,
        content: contentText.trim()
      });
      // 刷新当前父评论下的子评论列表
      const res = await api.childComments({ parentId: comment.id });
      setChildComments(prev => ({ ...prev, [comment.id]: res.data.result }));
      // 关闭该评论的回复框并清空内容
      setReplyVisible(prev => ({ ...prev, [commentId]: false }));
      setReplyContent(prev => ({ ...prev, [commentId]: '' }));
    } catch (error) {
      console.error('回复失败', error);
    }
  };

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
              {/* 回复按钮 */}
              <span
                className={styles.statItem}
                style={{ cursor: "pointer" }}
                onClick={() => handleReplyClick(comment.id)}
              >
                回复
              </span>
            </div>
          </div>

          {/* 回复输入框 */}
          {replyVisible[comment.id] && (
            <div className={styles.replyContainer}>
              <input
                type="text"
                placeholder="写下你的回复..."
                value={replyContent[comment.id] || ''}
                onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                className={styles.replyInput}
              />
              <button
                onClick={() => handleReplySubmit(comment.id)}
                className={styles.replyButton}
              >
                发送
              </button>
            </div>
          )}

          <div
            className="collapse"
            id={`childComments${comment.id}`}
          >
            {childComments[comment.id]?.map((child) => (
              <ChildCard
                key={child.id}
                comment={child}
                replyVisible={replyVisible}
                replyContent={replyContent}
                onReplyClick={handleReplyClick}
                onReplyChange={handleReplyChange}
                onReplySubmit={handleReplySubmit}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}