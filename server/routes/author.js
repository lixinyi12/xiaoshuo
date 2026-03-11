const express = require('express');
const router = express.Router();
const { ROLE_NAME } = require('../constants/role');
const { checkAuth, checkPermission, checkRole } = require('../middleware/auth');
const authorService = require('../services/authorService');

/**
 * 获取作者列表
 * @route GET /authorsList
 * @returns {object} { status: 200, data: authors, msg: '获取成功' }
 */
router.get('/authorsList', checkAuth, checkRole(ROLE_NAME.ADMIN), async (req, res) => {
    try {
        const authors = await authorService.getAllAuthors();
        res.send({ status: 200, data: authors, msg: '获取成功' });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 获取单个作者信息
 * @route GET /author
 * @param {string} req.params.id - 作者ID
 * @returns {object} { status: 200, data: author, msg: '获取成功' }
 */
router.get('/author', checkAuth, checkRole(ROLE_NAME.AUTHOR, ROLE_NAME.ADMIN), async (req, res) => {
    const { id } = req.params;
    try {
        const author = await authorService.getAuthorById(id);
        if (!author) {
            return res.status(404).send({ status: 404, msg: '作者不存在' });
        }
        res.send({ status: 200, data: author, msg: '获取成功' });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 创建作者
 * @route POST /createAuthor
 * @param {string} req.body.user_id - 关联的用户ID
 * @param {string} req.body.real_name - 真实姓名
 * @param {string} req.body.id_card - 身份证号
 * @param {string} req.body.pen_name - 笔名
 * @returns {object} { status: 201, data: author, msg: '创建成功' }
 */
router.post('/createAuthor', checkAuth, checkRole(ROLE_NAME.ADMIN), async (req, res) => {
    const { user_id, real_name, id_card, pen_name } = req.body;
    // 简单校验必填字段
    if (!user_id || !real_name || !id_card || !pen_name) {
        return res.status(400).send({ status: 400, msg: '缺少必要字段' });
    }
    try {
        const newAuthor = await authorService.addAuthor({ user_id, real_name, id_card, pen_name });
        res.status(201).send({ status: 201, data: newAuthor, msg: '创建成功' });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 更新作者信息
 * @route PUT /updateAuthor
 * @param {string} req.params.id - 作者ID
 * @param {string} req.body.real_name - 真实姓名
 * @param {string} req.body.id_card - 身份证号
 * @param {string} req.body.pen_name - 笔名
 * @returns {object} { status: 200, data: author, msg: '更新成功' }
 */
router.put('/updateAuthor', checkAuth, checkPermission(ROLE_NAME.AUTHOR, ROLE_NAME.ADMIN), async (req, res) => {
    const { id } = req.params;
    const { real_name, id_card, pen_name } = req.body;
    try {
        const updatedAuthor = await authorService.updateAuthor(id, { real_name, id_card, pen_name });
        if (!updatedAuthor) {
            return res.status(404).send({ status: 404, msg: '作者不存在' });
        }
        res.send({ status: 200, data: updatedAuthor, msg: '更新成功' });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 删除作者
 * @route DELETE /deleteAuthor
 * @param {string} req.params.id - 作者ID
 * @returns {object} { status: 200, msg: '删除成功' }
 */
router.delete('/deleteAuthor', checkAuth, checkPermission(ROLE_NAME.ADMIN), async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await authorService.deleteAuthorById(id);
        if (!deleted) {
            return res.status(404).send({ status: 404, msg: '作者不存在' });
        }
        res.send({ status: 200, msg: '删除成功' });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

module.exports = router;