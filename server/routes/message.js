const express = require('express');
const router = express.Router();
const { checkAuth, checkRole } = require('../middleware/auth');
const { ROLE_NAME } = require('../constants/role');
const {
    addMessage,
    getMessagesByReceiver,
    getUnreadCount,
    markAsRead,
    getMessageById,
    deleteMessages
} = require('../services/messageService');

/**
 * 发送消息
 * @route POST /sendMessage
 * @param {string} req.body.content - 消息内容
 * @param {number} req.body.receiver_id - 接收者ID
 * @param {string} req.body.message_type - 消息类型
 * @returns {object} { status: 200, msg: '消息发送成功', data: { insertId } }
 */
router.post('/sendMessage', checkAuth, checkRole(ROLE_NAME.ADMIN), async (req, res) => {
    try {
        const sender_id = req.user.id;
        const { content, receiver_id, message_type } = req.body.params;

        if (!content || !receiver_id || !message_type) {
            return res.status(400).send({ status: 400, msg: '内容/接收者ID/消息类型不能为空' });
        }

        const messageData = {
            content,
            sender_id,
            receiver_id,
            message_type
        };
        const result = await addMessage(messageData);
        res.send({
            status: 200,
            msg: '消息发送成功',
            data: { insertId: result.insertId }
        });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 获取当前用户的消息列表
 * @route GET /messagesList
 * @param {boolean} [req.query.is_read] - 筛选已读/未读，不传则全部
 * @param {string} [req.query.orderBy='created_at'] - 排序字段
 * @param {string} [req.query.order='DESC'] - 排序方向
 * @returns {object} { status: 200, data: Array }
 */
router.get('/messagesList', checkAuth, async (req, res) => {
    try {
        const receiver_id = req.user.id;
        const { is_read, orderBy, order } = req.query;

        const options = {};
        if (is_read !== undefined) options.is_read = is_read === 'true';
        if (orderBy) options.orderBy = orderBy;
        if (order) options.order = order;

        const messages = await getMessagesByReceiver(receiver_id, options);
        res.send({ status: 200, data: messages });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 获取当前用户的未读消息数量
 * @route GET /messagesUnreadCount
 * @returns {object} { status: 200, data: { unreadCount } }
 */
router.get('/messagesUnreadCount', checkAuth, async (req, res) => {
    try {
        const receiver_id = req.user.id;
        const count = await getUnreadCount(receiver_id);
        res.send({ status: 200, data: { unreadCount: count } });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 标记消息为已读（单条或批量）
 * @route PATCH /messagesRead
 * @param {number|number[]} req.body.params.messageIds - 消息ID或ID数组
 * @returns {object} { status: 200, msg: '已标记为已读', data: { affectedRows } }
 */
router.patch('/messagesRead', checkAuth, async (req, res) => {
    try {
        const receiver_id = req.user.id;
        const { messageIds } = req.body.params;

        if (!messageIds) {
            return res.status(400).send({ status: 400, msg: '请提供消息ID' });
        }

        const result = await markAsRead(messageIds, receiver_id);
        res.send({
            status: 200,
            msg: '已标记为已读',
            data: { affectedRows: result.affectedRows }
        });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 获取单条消息详情
 * @route GET /getMessageById
 * @param {number} req.query.id - 消息ID
 * @returns {object} { status: 200, data: { message } }
 */
router.get('/getMessageById', checkAuth, async (req, res) => {
    try {
        const message_id = req.query.id;
        const receiver_id = req.user.id;

        const message = await getMessageById(message_id);
        if (!message) {
            return res.status(404).send({ status: 404, msg: '消息不存在' });
        }
        if (message.receiver_id !== receiver_id) {
            return res.status(403).send({ status: 403, msg: '无权查看此消息' });
        }

        res.send({ status: 200, data: { message } });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 删除消息（单条或批量）
 * @route DELETE /deleteMessages
 * @param {number|number[]} req.query.messageIds - 消息ID或ID数组
 * @returns {object} { status: 200, msg: '删除成功', data: { affectedRows } }
 */
router.delete('/deleteMessages', checkAuth, async (req, res) => {
    try {
        const receiver_id = req.user.id;
        const { messageIds } = req.query;

        if (!messageIds) {
            return res.status(400).send({ status: 400, msg: '请提供消息ID' });
        }

        const result = await deleteMessages(messageIds, receiver_id);
        res.send({
            status: 200,
            msg: '删除成功',
            data: { affectedRows: result.affectedRows }
        });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

module.exports = router;