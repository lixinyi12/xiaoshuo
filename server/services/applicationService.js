const { query } = require('../config');

/**
 * 返回当前待审核任务数量最少的管理员ID
 * @returns {Promise<number|null>} 管理员ID，如果没有管理员则返回null
 */
exports.getLeastBusyReviewer = async () => {
    const sql = `
        SELECT u.user_id, COUNT(app.id) AS task_count
        FROM user_roles u
        LEFT JOIN application app ON u.user_id = app.reviewer_id AND app.status = '待审核'
        WHERE u.role_id = 3
        GROUP BY u.user_id
        ORDER BY task_count ASC
        LIMIT 1
    `;
    const result = await query(sql);
    return result && result.length > 0 ? result[0].user_id : null;
};

/**
 * 添加一条认证申请信息
 * @param {number} reviewerId 管理员ID
 * @param {Object} applicationData 申请数据
 * @param {number} applicationData.user_id 用户ID
 * @param {string} applicationData.real_name 真实姓名
 * @param {string} applicationData.phone 电话
 * @param {string} applicationData.email 邮箱
 * @param {string} applicationData.id_card 身份证号
 * @param {string} [applicationData.status] 状态，默认'待审核'
 * @returns {Promise<Object>} 插入结果
 */
exports.addApplication = async (reviewerId, applicationData) => {
    const { user_id, real_name, phone, email, id_card, status = '待审核' } = applicationData;

    // 插入申请记录
    const insertSql = `
        INSERT INTO application (user_id, real_name, phone, email, status, apply_time, id_card, reviewer_id)
        VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)
    `;
    const insertResult = await query(insertSql, [
        user_id, real_name, phone, email, status, id_card, reviewerId
    ]);

    // 返回插入结果，携带管理员ID
    return {
        ...insertResult,
        reviewerId
    };
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
 * 更新认证申请状态（审核操作），并返回关联的作者信息（如果存在）
 * @param {number} applicationId 申请ID
 * @param {string} status 新状态：'待审核'、'通过'、'拒绝'
 * @param {number} reviewerId 审核人ID
 * @param {string} [rejectReason] 拒绝理由，当 status 为 '拒绝' 时可选传入
 * @returns {Promise<Object>} 包含申请更新结果、user_id 及作者信息（若存在）的对象
 */
exports.updateApplicationStatus = async (applicationId, status, reviewerId, rejectReason) => {
    const selectSql = `SELECT user_id FROM application WHERE id = ?`;
    const selectResult = await query(selectSql, [applicationId]);

    if (selectResult.length === 0) {
        throw new Error('Application not found');
    }
    const userId = selectResult[0].user_id;

    let sql = `
        UPDATE application 
        SET status = ?, 
            reviewer_id = ?, 
            review_time = NOW()
    `;
    const params = [status, reviewerId];

    if (status === '拒绝' && rejectReason !== undefined) {
        sql += `, reject_reason = ?`;
        params.push(rejectReason);
    } else {
        sql += `, reject_reason = NULL`;
    }

    sql += ` WHERE id = ?`;
    params.push(applicationId);

    const updateResult = await query(sql, params);

    const authorSql = `SELECT * FROM authors WHERE user_id = ?`;
    const authorResult = await query(authorSql, [userId]);
    const authorInfo = authorResult.length > 0 ? authorResult[0] : null;

    return {
        user_id: userId,
        author: authorInfo,
        ...updateResult
    };
};

/**
 * 获取筛选后的所有认证申请
 * @param {Object} filters - 过滤条件
 * @param {string|number} [filters.reviewerId] - 管理员ID（可选）
 * @param {string} [filters.status] - 申请状态（可选，不传则返回所有）
 * @returns {Promise<Array>} 申请记录数组
 */
exports.getAllApplications = async (filters) => {
    const { reviewerId, status } = filters;

    let sql = `SELECT * FROM application`;
    const conditions = [];
    const params = [];

    // 添加 reviewerId 筛选条件（如果存在）
    if (reviewerId !== undefined && reviewerId !== null && reviewerId !== '') {
        conditions.push(`reviewer_id = ?`);
        params.push(reviewerId);
    }

    // 添加 status 筛选条件（如果存在且有效）
    if (status && ['待审核', '通过', '拒绝'].includes(status)) {
        conditions.push(`status = ?`);
        params.push(status);
    }

    // 如果有条件，拼接 WHERE 子句
    if (conditions.length > 0) {
        sql += ` WHERE ` + conditions.join(' AND ');
    }

    // 按申请时间倒序排列
    sql += ` ORDER BY apply_time DESC`;

    const results = await query(sql, params);
    return results;
};