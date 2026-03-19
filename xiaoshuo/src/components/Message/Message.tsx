import { useEffect, useState } from "react";
import { FaRegEnvelope, FaTrash, FaInfoCircle } from 'react-icons/fa';
import styles from './Message.module.css';
import React from "react";
import { messageApi } from "../../api";

interface Message {
    id: number,
    content: string,
    type: string,
    read: boolean
}

const MessageComponent = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [detailMessage, setDetailMessage] = useState<Message | null>(null); // 新增：当前查看的消息详情

    useEffect(() => {
        messageApi.messagesList({}).then(res => {
            const data = res.data.data;
            console.log(data);
            setMessages(data.map((item: any) => ({
                id: item.id,
                content: item.content,
                type: item.message_type,
                read: item.is_read === 1
            })) as Message[])
        })
    }, [])

    useEffect(() => {
        setUnreadCount(messages.filter((m) => !m.read).length)
    }, [messages])

    // 切换弹窗显示
    const togglePopup = () => setShowPopup((prev) => !prev);

    // 全部标记已读
    const markAllAsRead = async () => {
        try {
            const hasUnread = messages.some(m => !m.read);
            if (!hasUnread) {
                return;
            }
            await messageApi.messagesRead({ messageIds: messages.map(m => m.id) });
            setMessages(messages.map((m) => ({ ...m, read: true })));
        } catch (error) {
            console.log(error)
        }
    };

    // 单条标记已读
    const markAsRead = async (id: number) => {
        try {
            const message = messages.find(m => m.id === id);
            if (message?.read) {
                return;
            }
            await messageApi.messagesRead({ messageIds: id });
            setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
        } catch (error) {
            console.log(error)
        }
    };

    // 删除消息
    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await messageApi.deleteMessages({ messageIds: id });
            setMessages(messages.filter(m => m.id !== id));
        } catch (error) {
            console.error('删除失败', error);
        }
    };

    // 查看详情
    const handleViewDetail = (msg: Message, e: React.MouseEvent) => {
        e.stopPropagation();
        markAsRead(msg.id);
        setDetailMessage(msg);
    };

    // 关闭详情弹窗
    const closeDetail = () => setDetailMessage(null);

    const Icon = FaRegEnvelope as React.ComponentType<{ size?: number }>;
    const InfoIcon = FaInfoCircle as React.ComponentType<{ size?: number }>;
    const TrashIcon = FaTrash as React.ComponentType<{ size?: number }>;

    return (
        <div className={styles.envelopeContainer}>
            <button className={styles.envelopeButton} onClick={togglePopup}>
                <Icon size={28} />
                {unreadCount > 0 && <span className={styles.redDot}></span>}
            </button>

            {showPopup && (
                <div className={styles.popup}>
                    <div className={styles.popupHeader}>
                        <span>消息中心</span>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setShowPopup(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className={styles.messageList}>
                        {messages.length === 0 ? (
                            <div className={styles.noMessages}>暂无消息</div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`${styles.messageItem} ${!msg.read ? styles.unread : ''}`}
                                >
                                    {/* 左侧：类型和未读标记 */}
                                    <div className={styles.messageContent}>
                                        <span>{msg.type}</span>
                                        {!msg.read && (
                                            <span className={styles.unreadBadge}>新</span>
                                        )}
                                    </div>

                                    {/* 右侧：操作按钮 */}
                                    <div className={styles.messageActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={(e) => handleViewDetail(msg, e)}
                                            title="查看详情"
                                        >
                                            <InfoIcon size={16} />
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={(e) => handleDelete(msg.id, e)}
                                            title="删除"
                                        >
                                            <TrashIcon size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {messages.length > 0 && (
                        <div className={styles.popupFooter}>
                            <button onClick={markAllAsRead} className={styles.markAllBtn}>
                                全部标记已读
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 新增：详情弹窗 */}
            {detailMessage && (
                <div className={styles.detailOverlay} onClick={closeDetail}>
                    <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.detailHeader}>
                            <h3>消息详情</h3>
                            <button className={styles.closeBtn} onClick={closeDetail}>×</button>
                        </div>
                        <div className={styles.detailBody}>
                            <p><strong>{detailMessage.type}</strong></p>
                            <p>{detailMessage.content}</p>
                        </div>
                        <div className={styles.detailFooter}>
                            <button onClick={closeDetail} className={styles.closeDetailBtn}>关闭</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageComponent;