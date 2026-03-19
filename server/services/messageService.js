const { query } = require('../config');

/**
 * 添加一条新消息
 * @param {Object} messageData 消息数据
 * @param {string} messageData.content 消息内容
 * @param {number} messageData.sender_id 发送者ID
 * @param {number} messageData.receiver_id 接收者ID
 * @param {string} messageData.message_type 消息类型
 * @returns {Promise<Object>} 插入结果
 */
exports.addMessage = async (messageData) => {
    const { content, sender_id, receiver_id, message_type } = messageData;
    const sql = `
        INSERT INTO messages (content, sender_id, receiver_id, message_type, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;
    const result = await query(sql, [content, sender_id, receiver_id, message_type]);
    return result;
};

/**
 * 根据接收者ID获取消息列表
 * @param {number} receiver_id 接收者ID
 * @param {Object} [options] 可选参数
 * @param {boolean} [options.is_read] 筛选已读/未读，不传则全部
 * @param {string} [options.orderBy='created_at'] 排序字段
 * @param {string} [options.order='DESC'] 排序方向
 * @returns {Promise<Array>} 消息列表
 */
exports.getMessagesByReceiver = async (receiver_id, options = {}) => {
    const { is_read, orderBy = 'created_at', order = 'DESC' } = options;
    let sql = 'SELECT * FROM messages WHERE receiver_id = ?';
    const params = [receiver_id];

    if (is_read !== undefined) {
        sql += ' AND is_read = ?';
        params.push(is_read ? 1 : 0);
    }

    sql += ` ORDER BY ${orderBy} ${order}`;

    return await query(sql, params);
};

/**
 * 获取接收者的未读消息数量
 * @param {number} receiver_id 接收者ID
 * @returns {Promise<number>} 未读数量
 */
exports.getUnreadCount = async (receiver_id) => {
    const sql = 'SELECT COUNT(*) AS count FROM messages WHERE receiver_id = ? AND is_read = 0';
    const result = await query(sql, [receiver_id]);
    return result[0]?.count || 0;
};

/**
 * 标记消息为已读（支持单条或批量）
 * @param {number|number[]} messageIds 消息ID或ID数组
 * @param {number} [receiver_id] 接收者ID
 * @returns {Promise<Object>} 更新结果
 */
exports.markAsRead = async (messageIds, receiver_id = null) => {
    const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
    if (ids.length === 0) return { affectedRows: 0 };

    let sql = 'UPDATE messages SET is_read = 1 WHERE id IN (?)';
    const params = [ids];

    if (receiver_id) {
        sql += ' AND receiver_id = ?';
        params.push(receiver_id);
    }

    return await query(sql, params);
};

/**
 * 根据消息ID获取单条消息详情
 * @param {number} message_id 消息ID
 * @returns {Promise<Object|null>} 消息对象或null
 */
exports.getMessageById = async (message_id) => {
    const sql = 'SELECT * FROM messages WHERE id = ?';
    const result = await query(sql, [message_id]);
    return result[0] || null;
};

/**
 * 删除消息
 * @param {number|number[]} messageIds 消息ID或ID数组
 * @param {number} [receiver_id] 接收者ID
 * @returns {Promise<Object>} 删除结果
 */
exports.deleteMessages = async (messageIds, receiver_id = null) => {
    const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
    if (ids.length === 0) return { affectedRows: 0 };

    let sql = 'DELETE FROM messages WHERE id IN (?)';
    const params = [ids];

    if (receiver_id) {
        sql += ' AND receiver_id = ?';
        params.push(receiver_id);
    }

    return await query(sql, params);
};