import styles from "./CommentCard.module.css";
import { novelApi, userApi } from "../../api";
import { useState, useEffect } from "react";
import { createPopper } from '@popperjs/core';
import { createPortal } from 'react-dom';
import React from "react";
import { HttpStatusCode } from "axios";

interface Comment {
  id: number;
  novelId: number;
  userId: number;
  avatar?: string;
  nickname?: string;
  content?: string;
  novel?: string;
  time?: string;
  stats?: any[];
  parentAuthor?: any | null;
}

function ChildCard({
  comment = {},
  replyVisible,
  replyContent,
  onReplyClick,
  onReplyChange,
  onReplySubmit,
  onNicknameClick
}: any) {
  const {
    id,
    userId,
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
              <h4
                className={styles.userNickname}
                style={{ cursor: 'pointer' }}
                onClick={(e: any) => onNicknameClick(userId, nickname, e)}
              >
                {nickname}
              </h4>
            </div>
            <div className={styles.commentTime}>{time}</div>
          </div>
        </div>
        <div className={styles.commentContent}>
          {parentAuthor && <span>回复@{parentAuthor}：</span>}
          <span>{content}</span>
          <span
            className={`${styles.statItem} ${styles.reply}`}
            style={{ cursor: "pointer" }}
            onClick={() => onReplyClick(id)}
          >
            回复
          </span>
        </div>
        <div className={styles.commentFooter}>
        </div>
        {replyVisible[id] && (
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="写下你的回复..."
              value={replyContent[id] || ''}
              onChange={(e: any) => onReplyChange(id, e.target.value)}
              className={styles.replyInput}
            />
            <button onClick={() => onReplySubmit(id)} className={styles.replyButton}>
              发送
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentCard({ comment = {} as Comment }) {
  const {
    id,
    novelId,
    userId,
    avatar = "默认头像",
    nickname = "匿名用户",
    content = "暂无评论内容",
    novel = "未知小说",
    time = "未知时间",
    stats = [],
    parentAuthor = null
  } = comment;

  const safeStats = [stats?.[0] || "👍 0", stats?.[1] || "💬 0"];
  const [childComments, setChildComments] = useState<{ [commentId: number]: Array<object> }>({});
  const [showChildComments, setShowChildComments] = useState<{ [commentId: number]: boolean }>({});
  const [replyVisible, setReplyVisible] = useState<{ [commentId: number]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [commentId: number]: string }>({});
  const [isSelf, setisSelf] = useState(false);

  const initialLikeCount = parseInt(stats[0]?.replace(/[^0-9]/g, '')) || 0;
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeLoading, setLikeLoading] = useState(false);

  const likeClick = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await userApi.toggleLike({ userId, commentId: id });
      const { count } = res.data.data;
      setLikeCount(count);
    } catch (error) {
      console.log(error);
    } finally {
      setLikeLoading(false);
    }
  };

  // 用户弹窗状态
  const [showUserModal, setShowUserModal] = useState(false);
  const [targetUser, setTargetUser] = useState({ id: null, nickname: '' });
  const [isFollowing, setIsFollowing] = useState(false);

  // Popper 所需引用
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  // 当弹窗显示时创建 Popper 实例
  useEffect(() => {
    if (showUserModal && referenceElement && popperElement) {
      const popperInstance = createPopper(referenceElement, popperElement, {
        placement: 'right-start',
        modifiers: [
          { name: 'arrow', options: { element: arrowElement } },
          { name: 'offset', options: { offset: [0, 8] } },
          { name: 'flip', options: { fallbackPlacements: ['left-start', 'right-end'] } },
        ],
      });
      // 强制立即更新一次位置，解决初始渲染偏移
      popperInstance.update();
      return () => popperInstance.destroy();
    }
  }, [showUserModal, referenceElement, popperElement, arrowElement]);

  useEffect(() => {
    userApi.childComments({ parentId: comment.id }).then(res => {
      setChildComments((prev: any) => ({
        ...prev,
        [comment.id]: res.data.result
      }));
    });
  }, [comment.id]);

  const commentsClick = () => {
    setShowChildComments((prev: any) => ({
      ...prev,
      [comment.id]: !prev[comment.id]
    }));
  };

  const openUserModal = async (targetUserId: any, targetNickname: any, event: any) => {
    if (!targetUserId) return;
    setReferenceElement(event.currentTarget);
    setTargetUser({ id: targetUserId, nickname: targetNickname });
    try {
      const res = await userApi.checkFollowStatus({ followee_id: targetUserId });
      setIsFollowing(res.data.isFollowing);
    } catch (error) {
      console.error('获取关注状态失败', error);
      setIsFollowing(false);
    }
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setTargetUser({ id: null, nickname: '' });
  };

  const handleFollowToggle = async () => {
    try {
      const self = await (await userApi.follows({ followee_id: targetUser.id })).data.isSelf;
      if (isFollowing) {
        setIsFollowing(false);
      } else {
        setIsFollowing(true);
      }
      if (self) setisSelf(true);
    } catch (error) {
      console.error('操作失败', error);
    }
  };

  const handleReplyClick = (commentId: number) => {
    setReplyVisible((prev: any) => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
    if (replyVisible[commentId]) {
      setReplyContent((prev: any) => ({
        ...prev,
        [commentId]: ''
      }));
    }
  };

  const handleReplyChange = (commentId: any, value: any) => {
    setReplyContent((prev: any) => ({
      ...prev,
      [commentId]: value
    }));
  };

  const handleReplySubmit = async (commentId: number) => {
    const contentText = replyContent[commentId];
    if (!contentText?.trim()) return;
    try {
      await novelApi.addComment({
        novelId,
        parentId: commentId,
        content: contentText.trim()
      });
      const res = await novelApi.childComments({ parentId: comment.id });
      setChildComments((prev: any) => ({
        ...prev,
        [comment.id]: res.data.result
      }));
      setReplyVisible((prev: any) => ({
        ...prev,
        [commentId]: false
      }));
      setReplyContent((prev: any) => ({
        ...prev,
        [commentId]: ''
      }));
    } catch (error) {
      console.error('回复失败', error);
    }
  };

  return <>
    <div className="col-12 mb-3">
      <div className={styles.commentCard}>
        <div className={styles.commentHeader}>
          <div className={styles.userAvatar}>
            {avatar === "默认头像" ? (
              <div className={styles.defaultAvatar}>{nickname.charAt(0)}</div>
            ) : (
              <img src={avatar} alt={nickname} className={styles.avatarImg} />
            )}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userBasicInfo}>
              <h4
                className={styles.userNickname}
                style={{ cursor: 'pointer' }}
                onClick={(e: any) => openUserModal(userId, nickname, e)}
              >
                {nickname}
              </h4>
            </div>
            <div className={styles.commentNovel}>评论了《{novel}》</div>
            <div className={styles.commentTime}>{time}</div>
          </div>
        </div>
        <div className={styles.commentContent}>
          {parentAuthor && <span>回复@{parentAuthor}：</span>}
          <span>{content}</span>
        </div>
        <div className={styles.commentFooter}>
          <div className={styles.commentStats}>
            <span
              className={`${styles.statItem}`}
              onClick={likeClick}
            >
              👍 {likeCount}
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
            <span
              className={styles.statItem}
              style={{ cursor: "pointer" }}
              onClick={() => handleReplyClick(comment.id)}
            >
              回复
            </span>
          </div>
        </div>

        {replyVisible[comment.id] && (
          <div className={styles.replyContainer}>
            <input
              type="text"
              placeholder="写下你的回复..."
              value={replyContent[comment.id] || ''}
              onChange={(e: any) => handleReplyChange(comment.id, e.target.value)}
              className={styles.replyInput}
            />
            <button onClick={() => handleReplySubmit(comment.id)} className={styles.replyButton}>
              发送
            </button>
          </div>
        )}

        <div className="collapse" id={`childComments${comment.id}`}>
          {childComments[comment.id]?.map((child: any) => <ChildCard
            key={child.id}
            comment={child}
            replyVisible={replyVisible}
            replyContent={replyContent}
            onReplyClick={handleReplyClick}
            onReplyChange={handleReplyChange}
            onReplySubmit={handleReplySubmit}
            onNicknameClick={openUserModal}
          />)}
        </div>
      </div>
    </div>

    {/* 使用 Popper 定位的弹窗 */}
    {showUserModal && createPortal(
      <div ref={setPopperElement} style={{ zIndex: 1000 }} className={styles.popperWrapper}>
        <div className={styles.modalContent}>
          <h3>{targetUser.nickname}</h3>
          {isSelf ? (
            // 如果是自己，显示禁用按钮或提示
            null
          ) : (
            <button onClick={handleFollowToggle}>
              {isFollowing ? '取消关注' : '关注'}
            </button>
          )}
          <button onClick={closeUserModal}>关闭</button>
        </div>
        <div ref={setArrowElement} style={{ display: 'none' }} />
      </div>,
      document.body
    )}
  </>;
}