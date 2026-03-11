const { query } = require('../config');

/**
 * 添加一条认证申请信息
 * @param {Object} applicationData 申请数据
 * @returns {Promise<Object>} 插入操作的结果
 */
exports.addApplication = async (applicationData) => {
    const { user_id, real_name, phone, email, id_card, status = '待审核' } = applicationData;
    const sql = `
        INSERT INTO application (user_id, real_name, phone, email, status, apply_time, id_card)
        VALUES (?, ?, ?, ?, ?, NOW(), ?)
    `;
    const result = await query(sql, [user_id, real_name, phone, email, status, id_card]);
    return result;
};

/**
 * 根据ID删除一条认证申请信息
 * @param {number} applicationId 认证申请ID
 * @returns {Promise<Object>} 删除操作的结果
 */
exports.deleteApplicationById = async (applicationId) => {
    const sql = `
        DELETE FROM application
        WHERE id = ?
    `;
    const result = await query(sql, [applicationId]);
    return result;
};

/**
 * 更新认证申请状态（审核操作）
 * @param {number} applicationId 申请ID
 * @param {string} status 新状态：'待审核'、'通过'、'拒绝'
 * @param {number} reviewerId 审核人ID
 * @param {string} [rejectReason] 拒绝理由，当 status 为 '拒绝' 时可选传入
 * @returns {Promise<Object>} 更新操作的结果
 */
exports.updateApplicationStatus = async (applicationId, status, reviewerId, rejectReason) => {
    // 构建动态 SQL 和参数
    let sql = `
        UPDATE application 
        SET status = ?, 
            reviewer_id = ?, 
            review_time = NOW()
    `;
    const params = [status, reviewerId];

    // 如果状态为拒绝且提供了拒绝理由，则更新 reject_reason；否则设置为 NULL
    if (status === '拒绝' && rejectReason !== undefined) {
        sql += `, reject_reason = ?`;
        params.push(rejectReason);
    } else {
        sql += `, reject_reason = NULL`;
    }

    sql += ` WHERE id = ?`;
    params.push(applicationId);

    const result = await query(sql, params);
    return result;
};

/**
 * 获取筛选后的所有认证申请
 * @param {Object} filters - 过滤条件
 * @param {string} [filters.status] - 申请状态（不传则返回所有）
 * @returns {Promise<Array>} 申请记录数组
 */
exports.getAllApplications = async (filters = {}) => {
    const { status } = filters;

    let sql = `SELECT * FROM application`;
    const params = [];

    if (status) {
        sql += ` WHERE status = ?`;
        params.push(status);
    }

    // 按申请时间倒序排列
    sql += ` ORDER BY apply_time DESC`;

    const results = await query(sql, params);
    return results;
};