const express = require('express');
const router = express.Router();
const { checkAuth, checkRole } = require('../middleware/auth');
const { ROLE_NAME } = require('../constants/role');
const {
    addApplication,
    deleteApplicationById,
    updateApplicationStatus,
    getAllApplications
} = require('../services/applicationService');

/**
 * 提交认证申请
 * @route POST /addApplication
 * @param {string} req.body.realName - 真实姓名
 * @param {string} req.body.idNumber - 身份证号
 * @param {string} req.body.phone - 联系电话
 * @param {string} req.body.email - 电子邮箱
 * @returns {object} { status: 200, msg: '申请提交成功', data: { insertId } }
 */
router.post('/addApplication', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { realName, idNumber, phone, email } = req.body;
        const applicationData = {
            user_id: userId,
            real_name: realName,
            phone,
            email,
            id_card: idNumber,
            status: '待审核'
        };
        const result = await addApplication(applicationData);
        res.send({
            status: 200,
            msg: '申请提交成功',
            data: { insertId: result.insertId }
        });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 删除认证申请
 * @route DELETE /deleteApplication
 * @param {number} req.body.id - 申请ID
 * @returns {object} { status: 200, msg: '申请删除成功' }
 */
router.delete('/deleteApplication', checkAuth, checkRole(ROLE_NAME.ADMIN), async (req, res) => {
    try {
        const applicationId = req.body.id;
        await deleteApplicationById(applicationId);
        res.send({ status: 200, msg: '申请删除成功' });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 审核认证申请
 * @route PATCH /setApplication
 * @param {number} req.body.id - 申请ID
 * @param {string} req.body.status - 新状态：'通过' 或 '拒绝'
 * @param {string} [req.body.rejectReason] - 拒绝理由（当状态为'拒绝'时可选）
 * @returns {object} { status: 200, msg: '审核完成' }
 */
router.patch('/setApplication', checkAuth, checkRole(ROLE_NAME.ADMIN), async (req, res) => {
    try {
        const { id: applicationId, status, rejectReason } = req.body;
        const reviewerId = req.user.id;

        if (!['通过', '拒绝'].includes(status)) {
            return res.status(400).send({ status: 400, msg: '无效的状态值，只能为“通过”或“拒绝”' });
        }

        const result = await updateApplicationStatus(applicationId, status, reviewerId, rejectReason);
        res.send({ status: 200, msg: '审核完成' });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

/**
 * 获取所有认证申请
 * @route GET /getApplicationsList
 * @param {number} req.body.status - 申请类型
 * @returns {object} { status: 200, data: Array } - 申请列表
 */
router.get('/getApplicationsList', checkAuth, checkRole(ROLE_NAME.ADMIN), async (req, res) => {
    try {
        const { status } = req.query;
        const applications = await getAllApplications({ status });

        res.send({
            status: 200,
            data: applications
        });
    } catch (err) {
        res.status(500).send({ status: 500, msg: err.message });
    }
});

module.exports = router;